import { boolean, pgTable, varchar, integer } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: varchar("id").notNull(),
  title: varchar("title").notNull(),
  done: boolean("done").notNull(),
});

export const students = pgTable("students", {
  id: varchar("id").notNull(),
  email: varchar("email").notNull(),
  name: varchar("name").notNull(),
  enrollmentStatus: integer("enrollment_status").notNull(),
});