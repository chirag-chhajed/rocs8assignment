import { env } from "@/env.js";
import nodemailer from "nodemailer";

export const emailClient = nodemailer.createTransport({
  auth: {
    pass: env.SMTP_PASSWORD,
    user: env.SMTP_USER,
  },
  port: Number(env.SMTP_PORT),
  secure: Boolean(env.SMTP_SECURE),
  host: env.SMTP_HOST,
});
