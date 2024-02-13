// router/tags.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/tags', async (req, res) => {
  db.query('SELECT * FROM tags', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while retrieving tags' });
    } else {
      res.json(results.rows);
    }
  });
});

router.post('/tags', async (req, res) => {
  const { tag_name } = req.body;
  console.log('req.body:', req.body)

  try {
    const result = await db.query('INSERT INTO tags (tag_name) VALUES ($1) RETURNING *', [tag_name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;