import "dotenv/config";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

console.log(process.env.POSTGRES_DATABASE);
const client = new pg.Client({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: process.env.POSTGRES_SSL === true,
});

async function seedCategories() {
  try {
    await client.connect();
    console.log("Connected to database");

    const db = drizzle(client);

    await migrate(db, {
      migrationsFolder: "./migrations",
    });
    console.log("Migrations completed");

    for (let i = 0; i < 100; i += 1) {
      const categoryName = `${faker.commerce.productName()} ${faker.company.name()}`;
      const query = sql`INSERT INTO public.categories (name) VALUES (${categoryName})`;
      await db.execute(query);
    }
    console.log("Categories seeded");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}

seedCategories().catch((error) => {
  console.error("Unhandled error:", error);
});
