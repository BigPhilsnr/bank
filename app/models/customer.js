const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../services/databaseService");

class Customer extends Model {}

Customer.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
  },
  { sequelize, modelName: "customer" }
);

module.exports = Customer;
