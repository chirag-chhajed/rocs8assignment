import {
  addUserCategory,
  getCategories,
} from "@/controllers/categories.controller.js";
import { authenticate } from "@/middlewares/authenticate.js";
import { validateData } from "@/middlewares/validateSchema.js";
import { addCategorySchema } from "@/validations/categoryValidation.js";
import { Router } from "express";

export const categoriesRouter = Router();

categoriesRouter.get("/", authenticate, getCategories);

categoriesRouter.post(
  "/update/:categoryId",
  authenticate,
  validateData(addCategorySchema),
  addUserCategory,
);
