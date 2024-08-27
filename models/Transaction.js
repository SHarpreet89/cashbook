const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');  // Assuming User is defined in User.js

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    note_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'note',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    transactionType: {
      type: DataTypes.ENUM('Credit', 'Debit'),
      allowNull: false,
    },
    recurringTransaction: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'transaction',
  }
);

// Hooks for updating user balance
Transaction.addHook('afterCreate', async (transaction, options) => {
  try {
    const user = await User.findByPk(transaction.user_id);

    if (transaction.transactionType === 'Credit') {
      const newBalance = (parseFloat(user.balance) + parseFloat(transaction.amount)).toFixed(2);
      console.log(`New Balance (After Credit): ${newBalance}`);
      user.balance = parseFloat(newBalance);
    } else if (transaction.transactionType === 'Debit') {
      const newBalance = (parseFloat(user.balance) - parseFloat(transaction.amount)).toFixed(2);
      console.log(`New Balance (After Debit): ${newBalance}`);
      user.balance = parseFloat(newBalance);
    }

    await user.save();

    console.log(`Final Balance Saved: ${user.balance}`);
  } catch (error) {
    console.error('Error updating balance after creating transaction:', error);
  }
});


Transaction.addHook('afterDestroy', async (transaction, options) => {
  const user = await User.findByPk(transaction.user_id);

  if (transaction.transactionType === 'Credit') {
    user.balance -= parseFloat(transaction.amount);
  } else if (transaction.transactionType === 'Debit') {
    user.balance += parseFloat(transaction.amount);
  }

  await user.save();
});


Transaction.addHook('beforeUpdate', async (transaction, options) => {
  const t = await sequelize.transaction(); // Start a new transaction

  try {
    // Fetch the user's current balance and the old transaction values before update
    const previousTransaction = await Transaction.findByPk(transaction.id, { transaction: t });
    const user = await User.findByPk(transaction.user_id, { transaction: t });

    if (!previousTransaction || !user) {
      console.error('Could not fetch previous transaction or user data');
      await t.rollback(); // Rollback transaction if error occurs
      return;
    }

    const previousAmount = parseFloat(previousTransaction.amount);
    const updatedAmount = parseFloat(transaction.amount);

    // Ensure amounts and user balance are valid numbers
    if (isNaN(previousAmount) || isNaN(updatedAmount)) {
      console.error('Invalid transaction amounts detected. Previous:', previousAmount, 'Updated:', updatedAmount);
      await t.rollback(); // Rollback transaction if error occurs
      return;
    }

    let currentBalance = parseFloat(user.balance);
    if (isNaN(currentBalance)) {
      console.error('User balance is NaN, unable to proceed.');
      await t.rollback(); // Rollback transaction if error occurs
      return;
    }

    // Logging key details before update
    console.log('Transaction Edit Start:');
    console.log(`User Balance Before Edit: ${currentBalance}`);
    console.log(`Transaction ID: ${transaction.id}`);
    console.log(`Previous Transaction Type: ${previousTransaction.transactionType}`);
    console.log(`Previous Transaction Amount: ${previousAmount}`);
    console.log(`Updated Transaction Type: ${transaction.transactionType}`);
    console.log(`Updated Transaction Amount: ${updatedAmount}`);

    // Revert the impact of the previous transaction
    if (previousTransaction.transactionType === 'Credit') {
      currentBalance -= previousAmount;
      console.log(`Reverted Previous Credit of ${previousAmount}, New Balance: ${currentBalance}`);
    } else if (previousTransaction.transactionType === 'Debit') {
      currentBalance += previousAmount;
      console.log(`Reverted Previous Debit of ${previousAmount}, New Balance: ${currentBalance}`);
    }

    // Apply the impact of the updated transaction
    if (transaction.transactionType === 'Credit') {
      currentBalance += updatedAmount;
      console.log(`Applied New Credit of ${updatedAmount}, New Balance: ${currentBalance}`);
    } else if (transaction.transactionType === 'Debit') {
      currentBalance -= updatedAmount;
      console.log(`Applied New Debit of ${updatedAmount}, New Balance: ${currentBalance}`);
    }

    // Ensure the user balance is a valid number before saving
    if (isNaN(currentBalance)) {
      console.error('Final user balance is NaN, aborting save.');
      await t.rollback(); // Rollback transaction if error occurs
      return;
    }

    // Log the final user balance after the transaction edit
    console.log(`User Balance After Edit: ${currentBalance}`);

    // Set the new balance in the user object and save it
    user.balance = currentBalance;
    await user.save({ transaction: t });

    // Commit the transaction
    await t.commit();

    console.log('Transaction Edit Completed and User Balance Saved');

  } catch (error) {
    console.error('Error updating user balance after transaction update:', error);
    await t.rollback(); // Rollback transaction if error occurs
  }
});

module.exports = Transaction;
