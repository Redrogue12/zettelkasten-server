import express, { Request, Response } from "express";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get("/notes", authenticate, async (req: Request, res: Response) => {
  try {
    const notesResult = await req.pool.query("SELECT * FROM notes");

    const notes = await Promise.all(
      notesResult.rows.map(async (note) => {
        const tagsResult = await req.pool.query(
          "SELECT t.* FROM tags t INNER JOIN notes_tags nt ON nt.tag_id = t.tag_id WHERE nt.id = $1",
          [note.id]
        );

        return {
          ...note,
          tags:
            tagsResult.rows.length > 0 ? tagsResult.rows.map((row) => row) : [],
        };
      })
    );

    res.json(notes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving notes" });
  }
});

router.get("/notes/:id", authenticate, (req: Request, res: Response) => {
  req.pool.query(
    "SELECT * FROM notes WHERE id = $1",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "An error occurred while retrieving the note" });
      } else if (results.rows.length === 0) {
        res.status(404).json({ message: "Note not found" });
      } else {
        res.json(results.rows[0]);
      }
    }
  );
});

router.post("/notes", authenticate, async (req: Request, res: Response) => {
  const { note_text, note_title } = req.body;

  try {
    const result = await req.pool.query(
      "INSERT INTO notes (note_title, note_text) VALUES ($1, $2) RETURNING *",
      [note_title, note_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/notes/:id", authenticate, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { note_text, note_title } = req.body;

  try {
    const result = await req.pool.query(
      "UPDATE notes SET note_title = $1, note_text = $2 WHERE id = $3 RETURNING *",
      [note_title, note_text, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/notes/:id", authenticate, (req: Request, res: Response) => {
  req.pool.query(
    "DELETE FROM notes WHERE id = $1",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "An error occurred while deleting the note" });
      } else if (results.rowCount === 0) {
        res.status(404).json({ message: "Note not found" });
      } else {
        res.status(204).json({ message: "Note deleted" });
      }
    }
  );
});

export default router;
