// index.js
const express = require('express');
const notes = require('./routes/notes');
const tags = require('./routes/tags');
const pool = require('./db');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json()); // for parsing application/json

// Make pool accessible to our router
app.use((req,res,next) => {
  req.pool = pool;
  next();
});

// Use the routes
app.use('/', notes);
app.use('/', tags);

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = server;