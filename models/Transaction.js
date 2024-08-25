const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

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
                key: 'user_id',
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        transactionCategory: {
            type: DataTypes.STRING,
            references: {
                model: 'category',
                key: 'category_id',
            },
        },
        notes: {
            type: DataTypes.STRING,
            references: {
                model: 'note',
                key: 'note_id',
            },
        },
        // New field: transactionType (incoming or outgoing)
        transactionType: {
            type: DataTypes.ENUM('incoming', 'outgoing'),
            allowNull: false,
        },
        // New field: recurringTransaction (true or false)
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

module.exports = Transaction;
