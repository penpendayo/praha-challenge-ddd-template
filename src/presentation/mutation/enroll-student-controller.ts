import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { EnrollStudentUseCase } from "../../application/use-case/enroll-student-use-case";
import { PostgresqlStudentRepository } from "../../infrastructure/repository/postgresql-student-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    enrollStudentUseCase: EnrollStudentUseCase;
  };
};

export const enrollStudentController = new Hono();

const enrollStudentUseCaseSchema = z.object({
  studentId: z.string(),
});

enrollStudentController.post(
  "/student/enroll",
  zValidator("json", enrollStudentUseCaseSchema, (result, c) => {
    if (!result.success) {
      return c.text("invalid body", 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const studentRepository = new PostgresqlStudentRepository(database);

    context.set(
      "enrollStudentUseCase",
      new EnrollStudentUseCase(studentRepository),
    );

    await next();
  }),
  async (context) => {
    const body = context.req.valid("json");
    const payload =
      await context.var.enrollStudentUseCase.invoke(body);

    return context.json(payload);
  },
);
