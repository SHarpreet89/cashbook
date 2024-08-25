const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class RecurringTransaction extends Model {}

RecurringTransaction.init(
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
        category: {
            type: DataTypes.STRING,
            references: {
                model: 'category',
                key: 'category_id'
            },
        },
        notes: {
            type: DataTypes.STRING,
            references: {
                model: 'note',
                key: 'note_id'
            }
        }
    },
    {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'recurringtransaction',
    }
);

module.exports = RecurringTransaction;