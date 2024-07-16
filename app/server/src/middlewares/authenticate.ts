import type { UserPayload } from "@/controllers/token.controller.js";
import { env } from "@/env.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    try {
      const decoded = jwt.verify(
        token,
        env.JWT_ACCESS_SECRET_KEY,
      ) as UserPayload;
      req.user = decoded;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(403).json({ message: "Access token has expired" });
      }
      return res.status(401).json({ message: "Invalid access token" });
    }
  } catch (error) {
    console.error("Error in authentication:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
