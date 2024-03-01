import { Pool } from "pg";

declare global {
  namespace Express {
    interface Request {
      pool: Pool;
      user: {
        userId?: any;
        user_id?: number;
        username?: string;
        email?: string;
        password?: string;
      };
    }
  }
}
