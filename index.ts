/// <reference path="./types/db-interfaces.d.ts" />
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import notes from "./routes/notes";
import tags from "./routes/tags";
import links from "./routes/links";
import pool from "./db";
import cors from "cors";

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json()); // for parsing application/json

// Make pool accessible to our router
app.use((req: Request, res: Response, next: NextFunction) => {
  req.pool = pool;
  if (!req.pool) {
    res.status(500).json({ message: "Database connection not available" });
    return;
  }
  next();
});

// Use the routes
app.use("/", notes);
app.use("/", tags);
app.use("/", links);

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = server;
