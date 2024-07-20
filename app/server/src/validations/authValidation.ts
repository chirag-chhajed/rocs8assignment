import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be minimum of 2 characters")
    .max(100, "Name must be maximum of 100 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be minimum of 8 characters")
    .regex(
      /(?=.*[A-Z])(?=.*[a-z])/,
      "Password must contain upper and lower case letters"
    )
    .regex(
      /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])/,
      "Password must contain special characters"
    ),
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
