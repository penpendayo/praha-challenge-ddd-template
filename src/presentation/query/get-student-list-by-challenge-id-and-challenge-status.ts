import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import type { StudentListByChallengeIdAndChallengeStatusQueryServiceInterface } from "../../application/query-service/students-list-by-challenge-id-and-chellenge-status-query-service";
import { ChallengeStatus } from "../../domain/challenge/challenge";
import { PostgresqlStudentListByChallengeIdAndChallengeStatusQueryService } from "../../infrastructure/query-service/postgresql-students-list-by-challenge-id-and-chellenge-status-query-service";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    studentListByChallengeIdAndChallengeStatusQueryService: StudentListByChallengeIdAndChallengeStatusQueryServiceInterface;
  };
};

export const getStudentListByChallengeIdAndChallengeStatusController =
  new Hono();

const getStudentListByChallengeIdAndChallengeStatusUseCaseSchema = z.object({
  challengeId: z.string(),
  challengeStatus: z.enum(ChallengeStatus),
  cursor: z.string().optional(),
  limit: z.number().optional(),
});

getStudentListByChallengeIdAndChallengeStatusController.get(
  "/students",
  zValidator(
    "json",
    getStudentListByChallengeIdAndChallengeStatusUseCaseSchema,
    (result, c) => {
      if (!result.success) {
        return c.text("invalid body", 400);
      }

      return;
    },
  ),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    context.set(
      "studentListByChallengeIdAndChallengeStatusQueryService",
      new PostgresqlStudentListByChallengeIdAndChallengeStatusQueryService(
        database,
      ),
    );

    await next();
  }),
  async (context) => {
    const body = context.req.valid("json");
    const payload =
      await context.var.studentListByChallengeIdAndChallengeStatusQueryService.invoke(
        body,
      );
    if (!payload) {
      return context.text("task not found", 404);
    }
    return context.json(payload);
  },
);
