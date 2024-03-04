/// <reference path="./src/types/db-interfaces.d.ts" />
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import notes from "./src/routes/notes";
import tags from "./src/routes/tags";
import links from "./src/routes/links";
import users from "./src/routes/users";
import pool from "./src/db";
import cors from "cors";

const app = express();

// Enable CORS for all routes
// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://zettelkasten-frontend.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
app.use("/", users);

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = server;
