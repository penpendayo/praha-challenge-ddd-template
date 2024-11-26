import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { RemoveTeamStudentUseCase } from "../../application/use-case/remove-team-student-use-case";
import { notification } from "../../infrastructure/api/notification";
import { PostgresqlStudentRepository } from "../../infrastructure/repository/postgresql-student-repository";
import { PostgresqlTeamRepository } from "../../infrastructure/repository/postgresql-team-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    removeTeamStudentUseCase: RemoveTeamStudentUseCase;
  };
};

export const leaveTeamStudentController = new Hono();

const leaveTeamStudentUseCaseSchema = z.object({
  studentId: z.string(),
  teamId: z.string(),
});

leaveTeamStudentController.post(
  "/student/remove",
  zValidator("json", leaveTeamStudentUseCaseSchema, (result, c) => {
    if (!result.success) {
      return c.text("invalid body", 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const teamRepository = new PostgresqlTeamRepository(database);
    const studentRepository = new PostgresqlStudentRepository(database);
    context.set(
      "removeTeamStudentUseCase",
      new RemoveTeamStudentUseCase(
        teamRepository,
        studentRepository,
        notification,
      ),
    );

    await next();
  }),
  async (context) => {
    const body = context.req.valid("json");
    const payload = await context.var.removeTeamStudentUseCase.invoke(body);

    return context.json(payload);
  },
);
