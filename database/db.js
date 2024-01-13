const { Pool } = require('pg');
const dotenv = require("dotenv").config();

// Replace the following with your PostgreSQL connection details
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT, // Usually 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
