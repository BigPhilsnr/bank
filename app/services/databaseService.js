const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mysql://root:root_password@mysql:3306/bank_db");

module.exports = {
  sequelize,
};
