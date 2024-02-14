const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../services/databaseService");

class Transaction extends Model {}

Transaction.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.STRING(10), allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    timestamp: { type: DataTypes.STRING(30), allowNull: false },
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    account_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "transaction" }
);

module.exports = Transaction;
