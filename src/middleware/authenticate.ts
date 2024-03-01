import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header required" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  try {
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const payload = jwt.verify(token, secret) as { userId: any };

    req.user = {
      userId: payload.userId,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;
