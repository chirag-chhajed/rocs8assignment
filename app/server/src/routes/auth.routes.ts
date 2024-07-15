import { registerUser } from "@/controllers/auth.controller.js";
import { validateData } from "@/middlewares/validateSchema.js";
import { signupSchema } from "@/validations/authValidation.js";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/signup", validateData(signupSchema), registerUser);

authRouter.post("/login", async (req, res) => {
  res.send("login");
});

authRouter.post("/logout", async (req, res) => {
  res.send("logout");
});
