import { z } from "zod";

export const addCategorySchema = z.object({
  isInterested: z.boolean(),
});

export type AddCategoryInput = z.infer<typeof addCategorySchema>;
