import {
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  verifyUser,
} from "@/controllers/auth.controller.js";
import { refreshingToken } from "@/controllers/token.controller.js";
import { validateData } from "@/middlewares/validateSchema.js";
import {
  loginSchema,
  resendSchema,
  signupSchema,
  verifySchema,
} from "@/validations/authValidation.js";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/signup", validateData(signupSchema), registerUser);

authRouter.post("/login", validateData(loginSchema), loginUser);

authRouter.post("/verify", validateData(verifySchema), verifyUser);

authRouter.post("/resend", validateData(resendSchema), resendVerificationEmail);

authRouter.get("/refresh", refreshingToken);

authRouter.post("/logout", logoutUser);
