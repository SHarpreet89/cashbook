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
      type: DataTypes.ENUM('incoming', 'outgoing'),
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
  const user = await User.findByPk(transaction.user_id);

  if (transaction.transactionType === 'incoming') {
    user.balance += parseFloat(transaction.amount);
  } else if (transaction.transactionType === 'outgoing') {
    user.balance -= parseFloat(transaction.amount);
  }

  await user.save();
});

Transaction.addHook('afterDestroy', async (transaction, options) => {
  const user = await User.findByPk(transaction.user_id);

  if (transaction.transactionType === 'incoming') {
    user.balance -= parseFloat(transaction.amount);
  } else if (transaction.transactionType === 'outgoing') {
    user.balance += parseFloat(transaction.amount);
  }

  await user.save();
});

Transaction.addHook('afterUpdate', async (transaction, options) => {
  const previousTransaction = transaction._previousDataValues;
  const user = await User.findByPk(transaction.user_id);

  if (previousTransaction.transactionType === 'incoming') {
    user.balance -= parseFloat(previousTransaction.amount);
  } else if (previousTransaction.transactionType === 'outgoing') {
    user.balance += parseFloat(previousTransaction.amount);
  }

  if (transaction.transactionType === 'incoming') {
    user.balance += parseFloat(transaction.amount);
  } else if (transaction.transactionType === 'outgoing') {
    user.balance -= parseFloat(transaction.amount);
  }

  await user.save();
});

module.exports = Transaction;
