import { pool } from "@/db/client.js";
import { authRouter } from "@/routes/auth.routes.js";
import { categoriesRouter } from "@/routes/categories.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "@/env.js";

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);

app.listen(env.PORT, async () => {
  try {
    await pool.connect();
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
  console.log(`Server started on http://localhost:${env.PORT}`);
});
