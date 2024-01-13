const { Pool } = require("pg");
const dotenv = require("dotenv").config();

const devConfig = {
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT, // Usually 5432
};

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
