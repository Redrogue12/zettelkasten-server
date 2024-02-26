import { Pool } from "pg";

declare global {
  namespace Express {
    interface Request {
      pool: Pool;
    }
  }
}
