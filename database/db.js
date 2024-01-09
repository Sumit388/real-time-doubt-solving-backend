const { Pool } = require('pg');

// Replace the following with your PostgreSQL connection details
const pool = new Pool({
  user: 'apple',
  host: 'localhost',
  database: 'students',
  password: 'Sumit388@',
  port: 5432, // Usually 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
