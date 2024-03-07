/// <reference path="./src/types/db-interfaces.d.ts" />
import http from "http";
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import notes from "./src/routes/notes";
import tags from "./src/routes/tags";
import links from "./src/routes/links";
import users from "./src/routes/users";
import pool from "./src/db";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

app.use((req: Request, res: Response, next: NextFunction) => {
  req.pool = pool;
  if (!req.pool) {
    console.error("Database connection not available");
    res.status(500).json({ message: "Database connection not available" });
    return;
  }
  next();
});

app.use("/", notes);
app.use("/", tags);
app.use("/", links);
app.use("/", users);

const server = http.createServer(app);
const port = Number(process.env.SERVER_PORT) || 10000;
const host = process.env.SERVER_HOSTNAME || "0.0.0.0";

server.listen(port, host, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});

module.exports = server;
