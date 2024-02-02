const { Pool } = require('pg');

const pool = new Pool({
  user: 'Red',
  host: 'localhost',
  database: 'zettelkasten-db',
  password: process.env.DB_PASSWORD,
  port: 5433, // PostgreSQL default port
});

module.exports = pool;
