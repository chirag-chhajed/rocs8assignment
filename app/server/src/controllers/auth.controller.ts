import { db } from "@/db/client.js";
import { otps, users } from "@/db/schema.js";
import { env } from "@/env.js";
import { loadEmailBlockList } from "@/utils/emailBlockList.js";
import { emailClient } from "@/utils/emailClient.js";
import { logger } from "@/utils/logger.js";
import { sendHTMLMail, sendPlainText } from "@/utils/mail.js";
import { generateTokens } from "@/utils/token.js";
import type {
  LoginInput,
  ResendInput,
  SignupInput,
  VerifyInput,
} from "@/validations/authValidation";
import bcrypt from "bcrypt";
import { and, desc, eq, gt } from "drizzle-orm";
import type { Request, Response } from "express";

const isProd = env.NODE_ENV_APP === "production";

export const registerUser = async (
  req: Request<{}, {}, SignupInput>,
  res: Response
) => {
  const { email, name, password } = req.body;
  try {
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length > 0) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    /**
     * Check if the email domain is blocked
     * If the email domain is blocked, return an error
     * Otherwise, continue with the registration process
     */
    const emailBlockList = await loadEmailBlockList();
    const isEmailBlocked = emailBlockList.includes(
      email.split("@")[1] as string
    );
    if (isEmailBlocked) {
      res
        .status(400)
        .json({ error: `${email.split("@")[1]} emails are blocked` });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    function generateEightDigitNumber(): string {
      return String(
        Math.floor(Math.random() * (99999999 - 10000000 + 1) + 10000000)
      );
    }
    const otp = generateEightDigitNumber();

    /**
     * Using a transaction to ensure that the user and OTP are inserted
     * into the database together
     * If the OTP insertion fails, the user insertion will also be rolled back
     */
    const newlyRegisteredUser = await db.transaction(async (trx) => {
      const [insertedUserInfo] = await trx
        .insert(users)
        .values({
          email,
          name,
          password: hashedPassword,
          // isVerified: true
        })
        .returning();
      await trx.insert(otps).values({
        otp,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
        userId: insertedUserInfo?.id,
      });
      await emailClient.sendMail({
        from: env.SMTP_USER,
        to: email,
        subject: "Verify your email",
        text: sendPlainText(otp),
        html: sendHTMLMail(otp),
      });
      return insertedUserInfo;
    });

    return res.status(201).json({ id: newlyRegisteredUser?.id });
  } catch (error) {
    logger.error(`err: "error in registerUser", ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
) => {
  const { email, password } = req.body;
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      res.status(401).json({ error: "User doesn not exists from this email" });
      return;
    }
    if (user.password) {
      const hashedPassword = await bcrypt.compare(password, user.password);
      if (!hashedPassword) {
        res.status(401).json({ error: "Password is incorrect" });
        return;
      }
      const tokens = generateTokens(user.id, user.email);
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
      });
      return res.status(200).json({ accessToken: tokens.accessToken });
    }
  } catch (error) {
    logger.error(`"Error in loginUser:" ${error}`);
    return res.status(500).json({ error: "Internal server" });
  }
};

export const verifyUser = async (
  req: Request<{}, {}, VerifyInput>,
  res: Response
) => {
  const { otp, id } = req.body;
  try {
    const [userOtps] = await db
      .select()
      .from(otps)
      .where(
        and(
          eq(otps.userId, id),
          eq(otps.otp, otp),
          eq(otps.isUsed, false),
          gt(otps.expiresAt, new Date())
        )
      )
      .orderBy(desc(otps.createdAt))
      .limit(1);

    if (!userOtps) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Using a transaction to ensure that the user and OTP are updated together
    const updateUserWithVerification = await db.transaction(async (trx) => {
      const [updatedUser] = await trx
        .update(users)
        .set({ isVerified: true })
        .where(eq(users.id, id))
        .returning();
      await trx
        .update(otps)
        .set({ isUsed: true })
        .where(eq(otps.id, userOtps.id));

      return updatedUser;
    });
    if (updateUserWithVerification) {
      const tokens = generateTokens(
        updateUserWithVerification?.id,
        updateUserWithVerification?.email
      );

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
      });
      return res.status(200).json({ accessToken: tokens.accessToken });
    }
  } catch (error) {
    logger.error(` Error in verifyUser: ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resendVerificationEmail = async (
  req: Request<{}, {}, ResendInput>,
  res: Response
) => {
  const { email } = req.body;
  try {
    const [userInfo] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.isVerified, false)))
      .limit(1);
    if (!userInfo) {
      return res
        .status(404)
        .json({ error: "User not found or already verified" });
    }

    function generateEightDigitNumber(): string {
      return String(
        Math.floor(Math.random() * (99999999 - 10000000 + 1) + 10000000)
      );
    }

    const newOtp = generateEightDigitNumber();
    await db.transaction(async (trx) => {
      await trx.delete(otps).where(eq(otps.userId, userInfo.id));
      await trx.insert(otps).values({
        otp: newOtp,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
        userId: userInfo.id,
      });
    });
    await emailClient.sendMail({
      from: env.SMTP_USER,
      to: email,
      subject: "Verify your email",
      text: `Your OTP is ${newOtp}`,
      html: `Your OTP is <b>${newOtp}</b>`,
    });
    return res.status(200).json({ id: userInfo.id });
  } catch (error) {
    logger.error(`Error in resendVerificationEmail:" ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    });
    logger.info("User logged out successfully");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Error during logout: ${error}`);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};
