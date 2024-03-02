// links.js
import express, { Request, Response } from "express";
const router = express.Router();

// Endpoint to create a link between two notes
router.post("/links", async (req: Request, res: Response) => {
  const { id1, id2 } = req.body;

  try {
    const result = await req.pool.query(
      "INSERT INTO note_links (from_note_id, to_note_id) VALUES ($1, $2) RETURNING *",
      [id1, id2]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to delete a link between two notes
router.delete("/links", async (req: Request, res: Response) => {
  const { id1, id2 } = req.query;

  if (!id1 || !id2) {
    console.error("Both from_note_id and to_note_id are required");
    return res
      .status(500)
      .json({ message: "Both from_note_id and to_note_id are required" });
  }

  try {
    await req.pool.query(
      "DELETE FROM note_links WHERE from_note_id = $1 AND to_note_id = $2",
      [id1, id2]
    );
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to get all links of a note
router.get("/links/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await req.pool.query(
      "SELECT n.* FROM notes n INNER JOIN note_links nl ON n.note_id = nl.to_note_id WHERE nl.from_note_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
