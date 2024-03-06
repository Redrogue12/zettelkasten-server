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

// Enable CORS for all routes
app.use(cors());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:8080",
//       "https://zettelkasten-frontend.vercel.app/",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// const allowCors = (req: Request, res: Response, next: NextFunction) => {
//   res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") {
//     res.status(200).end();
//     return;
//   }
//   next();
// };

app.use(express.json()); // for parsing application/json

app.use(morgan("dev"));

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

const server = http.createServer(app);
const port = Number(process.env.SERVER_PORT) || 10000;
const host = process.env.SERVER_HOSTNAME || "0.0.0.0";

server.listen(port, host, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});

module.exports = server;
