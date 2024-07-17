import { env } from "@/env.js";
import { generateTokens } from "@/utils/token.js";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface UserPayload extends jwt.JwtPayload {
  id: string;
  email: string;
}

const isProd = env.NODE_ENV_APP === "production";

export const refreshingToken = (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    res.clearCookie("refreshToken");

    if (!token) {
      return res.status(204).json({ error: "No refresh token found" });
    }

    let decoded: UserPayload;

    try {
      decoded = jwt.verify(token, env.JWT_REFRESH_SECRET_KEY) as UserPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(403).json({ error: "Refresh token has expired" });
      }
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const { id, email } = decoded;

    const { accessToken, refreshToken } = generateTokens(id, email);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error in refreshing token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
