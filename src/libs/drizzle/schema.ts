import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";

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
  teamId: varchar("team_id"),
});

export const studentRelations = relations(students, ({ one }) => ({
  posts: one(teams, {
    fields: [students.teamId],
    references: [teams.id]
  }),
}));

export const teams = pgTable("teams", {
  id: varchar("id").notNull(),
  name: varchar("name").notNull(),
});

export const teamRelations = relations(teams, ({ many }) => ({
  students: many(students),
}));