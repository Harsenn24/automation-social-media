const { DataTypes } = require('sequelize');
const dbSosmed = require('../config/index');

const userModel = dbSosmed.define(
    "users",
    {
        id: {
            autoIncrement: true,
            allowNull: false,
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        user_id: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        running: {
            allowNull: false,
            type: DataTypes.TINYINT,
        },
        detail: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED,
        },
    },
    {
        timestamps: false,  
    }
)

module.exports = userModel