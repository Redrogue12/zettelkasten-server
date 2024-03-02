import express, { Request, Response } from "express";
const router = express.Router();
const db = require("../db");

router.get("/tags/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) res.status(400).json({ message: "User ID is required" });
  req.pool.query(
    "SELECT * FROM tags WHERE user_id = $1",
    [id],
    (err: any, results: any) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "An error occurred while retrieving tags" });
      } else {
        res.json(results.rows);
      }
    }
  );
});

router.post("/tags", async (req, res) => {
  const { tag_name } = req.body;
  if (!tag_name) {
    res.status(400).json({ message: "Tag name is required" });
    return;
  }
  try {
    const result = await req.pool.query(
      "INSERT INTO tags (tag_name) VALUES ($1) RETURNING *",
      [tag_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/tags/:id", async (req, res) => {
  const { id } = req.params;
  const { tag_name } = req.body;
  console.log("tag_name:", tag_name);

  if (!tag_name) {
    res.status(400).json({ message: "Tag name is required" });
    return;
  }
  try {
    const result = await req.pool.query(
      "UPDATE tags SET tag_name = $1 WHERE tag_id = $2 RETURNING *",
      [tag_name, id]
    );
    console.log("success", result);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/tags/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Tag ID is required" });
    return;
  }
  try {
    const result = await req.pool.query(
      "DELETE FROM tags WHERE tag_id = $1 RETURNING *",
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// create endpoint to associate a tag with a note
router.post("/tags/link", async (req, res) => {
  const { note_id, tag_id } = req.body;
  try {
    const result = await req.pool.query(
      "INSERT INTO notes_tags (id, tag_id) VALUES ($1, $2) RETURNING *",
      [note_id, tag_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
