import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import type { StudentListQueryServiceInterface } from "../../application/query-service/students-list-query-service";
import { PostgresqlStudentListQueryService } from "../../infrastructure/query-service/postgresql-student-list-query-service";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    studentListQueryService: StudentListQueryServiceInterface;
  };
};

export const getStudentListController = new Hono();

getStudentListController.get(
  "/students",
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    context.set("studentListQueryService", new PostgresqlStudentListQueryService(database));

    await next();
  }),
  async (context) => {
    const payload = await context.var.studentListQueryService.invoke();
    if (!payload) {
      return context.text("task not found", 404);
    }
    return context.json(payload);
  },
);
