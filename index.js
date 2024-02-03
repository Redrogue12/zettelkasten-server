// index.js
const express = require('express');
const routes = require('./routes/notes');
const pool = require('./db');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Make pool accessible to our router
app.use((req,res,next) => {
  req.pool = pool;
  next();
});

// Use the routes
app.use('/', routes);

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = server;