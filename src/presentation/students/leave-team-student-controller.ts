import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { LeaveTeamStudentUseCase } from "../../application/use-case/leave-team-student-use-case";
import { PostgresqlTeamRepository } from "../../infrastructure/repository/postgresql-team-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    leaveTeamStudentUseCase: LeaveTeamStudentUseCase;
  };
};

export const leaveTeamStudentController = new Hono();

const leaveTeamStudentUseCaseSchema = z.object({
  studentId: z.string(),
  teamId: z.string(),
});

leaveTeamStudentController.post(
  "/student/leave",
  zValidator("json", leaveTeamStudentUseCaseSchema, (result, c) => {
    if (!result.success) {
      return c.text("invalid body", 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const teamRepository = new PostgresqlTeamRepository(database);
    context.set(
      "leaveTeamStudentUseCase",
      new LeaveTeamStudentUseCase(teamRepository),
    );

    await next();
  }),
  async (context) => {
    const body = context.req.valid("json");
    const payload = await context.var.leaveTeamStudentUseCase.invoke(body);

    return context.json(payload);
  },
);
