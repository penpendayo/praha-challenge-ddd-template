import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
});

export const challengeRelations = relations(challenges, ({ many }) => ({
  students: many(students),
}));

export const students = pgTable("students", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  name: varchar("name").notNull(),
  enrollmentStatus: integer("enrollment_status").notNull(),
  teamId: varchar("team_id").references(() => teams.id),
});

export const studentRelations = relations(students, ({ one, many }) => ({
  team: one(teams, {
    fields: [students.teamId],
    references: [teams.id],
  }),
  challenges: many(challenges),
}));

export const studentsToChallenges = pgTable(
  "students_to_challenge",
  {
    studentId: varchar("student_id")
      .notNull()
      .references(() => students.id),
    challengeId: varchar("challenge_id")
      .notNull()
      .references(() => challenges.id),
    status: integer("status").notNull(),
  },
  (t) => ({
    unique: primaryKey({ columns: [t.challengeId, t.studentId] }),
  }),
);

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
});

export const teamRelations = relations(teams, ({ many }) => ({
  students: many(students),
}));
