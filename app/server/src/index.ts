import cookieParser from "cookie-parser";
import express from "express";
import { pool } from "@/db/client.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3434, async () => {
  try {
    await pool.connect();
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
  console.log("Server started on http://localhost:3434");
});
