import { pool } from "@/db/client.js";
import { env } from "@/env.js";
import { authRouter } from "@/routes/auth.routes.js";
import { categoriesRouter } from "@/routes/categories.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { logger, httpLogger } from "@/utils/logger.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);

app.listen(env.PORT, async () => {
  try {
    await pool.connect();
    logger.info("Connected to the database");
  } catch (error) {
    logger.error({ err: "Failed to connect to the database", error });
    process.exit(1);
  }
  logger.info(`Server started on http://localhost:${env.PORT}`);
});
