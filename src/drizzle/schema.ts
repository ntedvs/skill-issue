import { sql } from "drizzle-orm"
import { boolean, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"

const uuid = text()
  .primaryKey()
  .default(sql`gen_random_uuid()`)

export const usersTable = pgTable("users", {
  id: uuid,
  email: text().notNull().unique(),
})

export const sessionsTable = pgTable("sessions", {
  sessionToken: text().primaryKey(),
  expires: timestamp().notNull(),

  userId: text()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
})

export const verificationsTable = pgTable(
  "verifications",
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp().notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
)

export const resumesTable = pgTable("resumes", {
  id: uuid,
  userId: text()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  filename: text().notNull(),
  extractedText: text().notNull(),
  skills: text().notNull(),
  uploadedAt: timestamp().notNull().default(sql`now()`),
})

export const reportsTable = pgTable("reports", {
  id: uuid,
  userId: text()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  resumeId: text()
    .notNull()
    .references(() => resumesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().notNull().default(sql`now()`),
  jobUrl: text().notNull(),
  jobTitle: text().notNull(),
  companyName: text().notNull(),
  jobContent: text().notNull(),
  scrapingSucceeded: boolean().notNull(),
  resumeScreeningChance: text().notNull(),
  strengthFactors: text().notNull(),
  weaknessFactors: text().notNull(),
  improvementRoadmap: text().notNull(),
})

export type User = typeof usersTable.$inferSelect
export type Resume = typeof resumesTable.$inferSelect
export type Report = typeof reportsTable.$inferSelect
