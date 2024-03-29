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

router.post("/tags/id/:id", async (req, res) => {
  console.log("/tags/id endpoint");
  const { tag_name } = req.body;
  const { id } = req.params;
  if (!tag_name || !id) {
    res.status(400).json({ message: "Tag name and user id is required" });
    return;
  }
  try {
    const result = await req.pool.query(
      "INSERT INTO tags (tag_name, user_id) VALUES ($1, $2) RETURNING *",
      [tag_name, id]
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
  if (!id) {
    res.status(400).json({ message: "Tag ID is required" });
    return;
  }
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
  console.log("/tags/link endpoint");
  const { note_id, tag_id } = req.body;
  if (!note_id || !tag_id) {
    console.error(
      "Note ID and Tag ID are required in /tags/link endpoint",
      note_id,
      tag_id
    );
    res.status(400).json({ message: "Note ID and Tag ID are required" });
    return;
  }
  try {
    const result = await req.pool.query(
      "INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2) RETURNING *",
      [note_id, tag_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
