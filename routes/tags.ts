import express, { Request, Response } from "express";
const router = express.Router();
const db = require("../db");

router.get("/tags", async (req: Request, res: Response) => {
  req.pool.query("SELECT * FROM tags", (err: any, results: any) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while retrieving tags" });
    } else {
      res.json(results.rows);
    }
  });
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

export default router;
