import { db } from "@/db/client.js";
import { otps, users } from "@/db/schema.js";
import { loadEmailBlockList } from "@/utils/emailBlockList.js";
import type { SignupInput } from "@/validations/authValidation";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { emailClient } from "@/utils/emailClient.js";

export const registerUser = async (
  req: Request<{}, {}, SignupInput>,
  res: Response
) => {
  const { email, name, password } = req.body;

  const user = await db.select().from(users).where(eq(users.email, email));
  if (user.length > 0) {
    res.status(409).json("User already exists");
    return;
  }

  const emailBlockList = await loadEmailBlockList();
  const isEmailBlocked = emailBlockList.includes(email.split("@")[1] as string);
  if (isEmailBlocked) {
    res.status(400).json("Email is blocked");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const insertedUser = await db
    .insert(users)
    .values({
      email,
      name,
      password: hashedPassword,
    })
    .returning();

  const otp = nanoid(8);

  const info = await emailClient.sendMail({
    from: "Your Name <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email",
    text: `Your OTP is ${otp}`,
    html: `Your OTP is <b>${otp}</b>`,
  });

  await db.insert(otps).values({
    otp,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    userId: insertedUser[0].id,
  });

  res.status(201).json("User created successfully");
};
