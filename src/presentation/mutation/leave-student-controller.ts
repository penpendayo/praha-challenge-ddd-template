import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { LeaveStudentUseCase } from "../../application/use-case/leave-student-use-case copy";
import { PostgresqlStudentRepository } from "../../infrastructure/repository/postgresql-student-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    leaveStudentUseCase: LeaveStudentUseCase;
  };
};

export const leaveStudentController = new Hono();

const leaveStudentUseCaseSchema = z.object({
  studentId: z.string(),
});

leaveStudentController.post(
  "/student/leave",
  zValidator("json", leaveStudentUseCaseSchema, (result, c) => {
    if (!result.success) {
      return c.text("invalid body", 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const studentRepository = new PostgresqlStudentRepository(database);

    context.set(
      "leaveStudentUseCase",
      new LeaveStudentUseCase(studentRepository),
    );

    await next();
  }),
  async (context) => {
    const body = context.req.valid("json");
    const payload = await context.var.leaveStudentUseCase.invoke(body);

    return context.json(payload);
  },
);
