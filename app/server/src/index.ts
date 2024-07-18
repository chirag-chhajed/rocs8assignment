import { pool } from "@/db/client.js";
import { env } from "@/env.js";
import { authRouter } from "@/routes/auth.routes.js";
import { categoriesRouter } from "@/routes/categories.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

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
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
  console.log(`Server started on http://localhost:${env.PORT}`);
});

// Handle application termination
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Closing database connection and exiting...");
  await closeDbConnection();
  process.exit(0);
});

async function closeDbConnection() {
  try {
    await pool.end();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
}
