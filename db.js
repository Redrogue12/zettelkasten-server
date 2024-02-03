// db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'Red',
  password: process.env.DB_PASSWORD,
  database: 'zettelkasten-db',
  port: 5433
});

module.exports = pool;