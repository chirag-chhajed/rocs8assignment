import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name should me more then 2 letters")
    .max(100, "Name should me less then 10 letters"),
  password: z.string().trim().min(8).max(20),
  email: z.string().trim().email("Invalid email address"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  password: z.string().trim(),
  email: z.string().trim().email("Invalid email address"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const verifySchema = z.object({
  otp: z.string().trim().length(8),
  id: z.coerce.number(),
});

export type VerifyInput = z.infer<typeof verifySchema>;

export const resendSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export type ResendInput = z.infer<typeof resendSchema>;
