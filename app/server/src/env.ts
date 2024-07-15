import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PORT: z.string(),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DATABASE: z.string().min(1),
    JWT_ACCESS_SECRET_KEY: z.string().min(1),
    JWT_REFRESH_SECRET_KEY: z.string().min(1),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.string(),
    SMTP_USER: z.string().min(1),
    SMTP_PASSWORD: z.string().min(1),
    SMTP_SECURE: z.enum(["true", "false"]),
  },
  runtimeEnv: process.env,
});

const envVariables = z.object({
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.string(),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DATABASE: z.string().min(1),
  JWT_ACCESS_SECRET_KEY: z.string().min(1),
  JWT_REFRESH_SECRET_KEY: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_SECURE: z.enum(["true", "false"]),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
