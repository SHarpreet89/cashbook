const { Model, DataTypes } = require('sequelize');
//const sequelize = require('../config/connection');

class Note extends Model {}

Note.init(
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
        transaction_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'transaction',
                key: 'transaction_id',
            }
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'note',
    }
);

module.exports = Note;