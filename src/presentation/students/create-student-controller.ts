import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { CreateStudentUseCase } from "../../application/use-case/create-student-use-case";
import { studentSchema } from "../../domain/sudent/student";
import { PostgresqlStudentRepository } from "../../infrastructure/repository/postgresql-student-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    createStudentUseCase: CreateStudentUseCase;
  };
};

export const createStudentListController = new Hono();

const createStudentUseCaseBodySchema = studentSchema;

createStudentListController.post(
  "/student",
  zValidator("json", createStudentUseCaseBodySchema, (result, c) => {
    if (!result.success) {
      return c.text("invalid body", 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const studentRepository = new PostgresqlStudentRepository(database);
    context.set(
      "createStudentUseCase",
      new CreateStudentUseCase(studentRepository),
    );

    await next();
  }),
  async (context) => {
    const body = context.req.valid("json");
    const payload = await context.var.createStudentUseCase.invoke(body);
    if (!payload) {
      return context.text("task not found", 404);
    }
    return context.json(payload);
  },
);
