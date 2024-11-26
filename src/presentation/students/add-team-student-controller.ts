import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { AddTeamStudentUseCase } from "../../application/use-case/add-team-student-use-case";
import { PostgresqlStudentRepository } from "../../infrastructure/repository/postgresql-student-repository";
import { PostgresqlTeamRepository } from "../../infrastructure/repository/postgresql-team-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    addTeamStudentUseCase: AddTeamStudentUseCase;
  };
};

export const enrollTeamStudentController = new Hono();

const enrollTeamStudentUseCaseSchema = z.object({
  studentId: z.string(),
  teamId: z.string(),
});

enrollTeamStudentController.post(
  "/student/add",
  zValidator("json", enrollTeamStudentUseCaseSchema, (result, c) => {
    if (!result.success) {
      return c.text("invalid body", 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const studentRepository = new PostgresqlStudentRepository(database);
    const teamRepository = new PostgresqlTeamRepository(database);
    context.set(
      "addTeamStudentUseCase",
      new AddTeamStudentUseCase(studentRepository, teamRepository),
    );

    await next();
  }),
  async (context) => {
    const body = context.req.valid("json");
    const payload = await context.var.addTeamStudentUseCase.invoke(body);

    return context.json(payload);
  },
);
