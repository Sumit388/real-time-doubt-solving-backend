const { Pool } = require("pg");
const dotenv = require("dotenv").config();

const devConfig = {
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT, // Usually 5432
};

const propConfig = {
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
};

const pool = new Pool(
  process.env.NODE_ENV === "production" ? propConfig : devConfig
);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
