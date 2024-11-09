import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique().notNull(),
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
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
});

export const teamRelations = relations(teams, ({ many }) => ({
  students: many(students),
}));