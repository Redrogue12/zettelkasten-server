// routes.js
const express = require('express');
const router = express.Router();

router.get('/notes', (req, res) => {
  req.pool.query('SELECT * FROM notes', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while retrieving notes' });
    } else {
      res.json(results.rows);
    }
  });
});

router.get('/notes/:id', (req, res) => {
  req.pool.query('SELECT * FROM notes WHERE id = $1', [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while retrieving the note' });
    } else if (results.rows.length === 0) {
      res.status(404).json({ message: 'Note not found' });
    } else {
      res.json(results.rows[0]);
    }
  });
});

router.delete('/notes/:id', (req, res) => {
  req.pool.query('DELETE FROM notes WHERE id = $1', [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while deleting the note' });
    } else if (results.rowCount === 0) {
      res.status(404).json({ message: 'Note not found' });
    } else {
      res.json({ message: 'Note deleted' });
    }
  });
});

module.exports = router;