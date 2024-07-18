import { env } from "@/env.js";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

export const pool = new pg.Pool({
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  ssl: env.POSTGRES_SSL,
});

const db = drizzle(pool);

export { db };
