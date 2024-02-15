const { Sequelize } = require("sequelize");
require('dotenv').config();
// Retrieve database credentials from environment variables
const DB_USERNAME = process.env.DB_USERNAME || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "root_password";
const DB_HOST = process.env.DB_HOST || "mysql";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_NAME = process.env.DB_NAME || "bank_db";

// Initialize Sequelize instance with environment variables
const sequelize = new Sequelize(`mysql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);



module.exports = {
  sequelize,
};
