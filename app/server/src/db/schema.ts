import {
  boolean,
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    passwordIdx: index("password_idx").on(table.password),
  }),
);

export const otps = pgTable(
  "otps",
  {
    id: serial("id").primaryKey(),
    userId: serial("user_id")
      .notNull()
      .references(() => users.id),
    otp: varchar("otp", { length: 8 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
    isUsed: boolean("is_used").notNull().default(false),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    otpIdx: index("otp_idx").on(table.otp),
  }),
);
