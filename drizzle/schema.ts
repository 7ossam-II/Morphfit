import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const gymLocations = mysqlTable("gym_locations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  redirectUrl: varchar("redirectUrl", { length: 512 }).default("https://morphfit.shop"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GymLocation = typeof gymLocations.$inferSelect;
export type InsertGymLocation = typeof gymLocations.$inferInsert;

export const qrScans = mysqlTable("qr_scans", {
  id: int("id").autoincrement().primaryKey(),
  locationId: int("locationId").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  redirectDestination: varchar("redirectDestination", { length: 512 }),
  userAgent: text("userAgent"),
});

export type QrScan = typeof qrScans.$inferSelect;
export type InsertQrScan = typeof qrScans.$inferInsert;

export const emailSignups = mysqlTable("email_signups", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailSignup = typeof emailSignups.$inferSelect;
export type InsertEmailSignup = typeof emailSignups.$inferInsert;