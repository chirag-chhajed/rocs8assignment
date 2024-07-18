import { env } from "@/env.js";
import nodemailer from "nodemailer";

export const emailClient = nodemailer.createTransport({
  auth: {
    pass: env.SMTP_PASSWORD,
    user: env.SMTP_USER,
  },
  port: env.SMTP_PORT,
  host: env.SMTP_HOST,
});
