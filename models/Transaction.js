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

Transaction.addHook('afterUpdate', async (transaction, options) => {
  const previousTransaction = transaction._previousDataValues;
  const user = await User.findByPk(transaction.user_id);

  // Parse the previous and updated amounts as floats
  const previousAmount = parseFloat(previousTransaction.amount);
  const updatedAmount = parseFloat(transaction.amount);

  // Log the previous and current amounts, and check if they are valid numbers
  console.log('Previous transaction amount:', previousAmount, 'Type:', typeof previousAmount);
  console.log('Updated transaction amount:', updatedAmount, 'Type:', typeof updatedAmount);

  if (isNaN(previousAmount) || isNaN(updatedAmount)) {
    console.error('Invalid transaction amounts detected. Previous:', previousAmount, 'Updated:', updatedAmount);
    return;
  }

  // Ensure user's balance is a valid number before updating it
  const currentBalance = parseFloat(user.balance);
  console.log('User balance before update:', currentBalance, 'Type:', typeof currentBalance);

  if (isNaN(currentBalance)) {
    console.error('User balance is NaN, unable to proceed.');
    return;
  }

  // Adjust the user's balance based on the transaction types
  if (previousTransaction.transactionType === 'Credit') {
    console.log('Previous transaction was Credit, deducting from user balance:', previousAmount);
    user.balance = currentBalance - previousAmount;
  } else if (previousTransaction.transactionType === 'Debit') {
    console.log('Previous transaction was Debit, adding to user balance:', previousAmount);
    user.balance = currentBalance + previousAmount;
  }

  // Adjust the balance for the new transaction
  if (transaction.transactionType === 'Credit') {
    console.log('Updated transaction is Credit, adding to user balance:', updatedAmount);
    user.balance = user.balance + updatedAmount;
  } else if (transaction.transactionType === 'Debit') {
    console.log('Updated transaction is Debit, deducting from user balance:', updatedAmount);
    user.balance = user.balance - updatedAmount;
  }

  // Log the final user balance before saving
  console.log('User balance after transaction update:', user.balance);

  // Ensure the user balance is a valid number before saving
  if (isNaN(user.balance)) {
    console.error('Final user balance is NaN, aborting save.');
    return;
  }

  await user.save();
});

module.exports = Transaction;
