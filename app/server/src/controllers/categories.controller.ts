import { db } from "@/db/client.js";
import { categories, userCategories } from "@/db/schema.js";
import { and, count, eq, sql } from "drizzle-orm";
import type { Request, Response } from "express";

type UserCategory = {
  categoryId: string;
};

export const getCategories = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const pageSize = 6;
    const [totalCategories] = await db
      .select({ count: count(categories.name) })
      .from(categories);

    const totalCount = totalCategories?.count;
    if (!totalCount) {
      return;
    }
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    const categoriesResult = await db
      .select({
        id: categories.id,
        name: categories.name,
        isInterested:
          sql<boolean>`COALESCE(${userCategories.isInterested}, false)`.as(
            "is_interested",
          ),
      })
      .from(categories)
      .leftJoin(
        userCategories,
        and(
          eq(userCategories.categoryId, categories.id),
          eq(userCategories.userId, Number.parseInt(userId)),
        ),
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(categories.name);

    return res.json({
      categories: categoriesResult,
      currentPage: page,
      totalPages,
      pageSize,
      totalCount,
      hasPrevious: hasPreviousPage,
      hasNext: hasNextPage,
    });
  } catch (error) {
    console.error("Failed to fetch categories", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const addUserCategory = async (
  req: Request<UserCategory, {}, { isInterested: boolean }>,
  res: Response,
) => {
  const userId = req.user?.id;
  const { categoryId } = req.params;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const [updatedCategories] = await db
      .insert(userCategories)
      .values({
        userId: Number(userId),
        categoryId: Number.parseInt(categoryId),
        isInterested: req.body.isInterested,
      })
      .onConflictDoUpdate({
        target: [userCategories.userId, userCategories.categoryId],
        set: {
          isInterested: req.body.isInterested,
          updatedAt: new Date(),
        },
      })
      .returning();

    return res.json({ message: "Category added successfully" });
  } catch (error) {
    console.error("Failed to add category", error);
    return res.status(500).json({ message: "Failed to add category" });
  }
};
