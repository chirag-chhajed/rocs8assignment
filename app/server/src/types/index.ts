import type jwt from "jsonwebtoken";

export interface UserPayload extends jwt.JwtPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
