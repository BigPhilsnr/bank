const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../services/databaseService");

class Account extends Model {}

Account.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    balance: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING(3), allowNull: false },
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "account" }
);

module.exports = Account;
