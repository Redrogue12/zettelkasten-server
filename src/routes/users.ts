import express, { Request, Response } from "express";
const router = express.Router();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

router.post("/validate", async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const secret: any = process.env.JWT_SECRET;
    const valid = jwt.verify(token, secret);
    if (valid) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (err) {
    console.error(err);
    res.json({ valid: false });
  }
});

router.post("/signup", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  console.log("req.body:", req.body);

  if (!username || !email || !password) {
    res
      .status(400)
      .json({ message: "Username, email and password are required" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const response = await req.pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING username, email, password_hash",
      [username, email, hashedPassword]
    );

    if (response.rowCount === 0) {
      res
        .status(500)
        .json({ message: "An error occurred while creating the user" });
      return;
    }

    const user = response.rows[0];
    const secret: any = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: user?.user_id }, secret);

    delete user.password_hash;
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const { rows } = await req.pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = rows[0];

  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ message: "JWT_SECRET is not defined" });
    return;
  }

  const token = jwt.sign({ userId: user.user_id }, secret);

  delete user.password_hash;
  res.json({ user, token });
});

export default router;
