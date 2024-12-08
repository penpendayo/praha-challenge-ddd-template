import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { WithdrawStudentUseCase } from "../../application/use-case/withdraw-student-use-case";
import { PostgresqlStudentRepository } from "../../infrastructure/repository/postgresql-student-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    withdrawStudentUseCase: WithdrawStudentUseCase;
  };
};

export const withdrawStudentController = new Hono();

const withdrawStudentUseCaseSchema = z.object({
  studentId: z.string(),
});

withdrawStudentController.post(
  "/student/withdraw",
  zValidator("json", withdrawStudentUseCaseSchema, (result, c) => {
    if (!result.success) {
      return c.text("invalid body", 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const studentRepository = new PostgresqlStudentRepository(database);

    context.set(
      "withdrawStudentUseCase",
      new WithdrawStudentUseCase(studentRepository),
    );

    await next();
  }),
  async (context) => {
    const body = context.req.valid("json");
    const payload = await context.var.withdrawStudentUseCase.invoke(body);

    return context.json(payload);
  },
);
