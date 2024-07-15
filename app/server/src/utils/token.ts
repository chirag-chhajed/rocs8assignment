import { env } from "@/env.js";
import jwt from "jsonwebtoken";
env;
const generateTokens = (userId: string | number, email: string) => {
  const payload = { id: userId, email };
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: "15m",
    algorithm: "HS256",
  });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
  return { accessToken, refreshToken };
};

export { generateTokens };
