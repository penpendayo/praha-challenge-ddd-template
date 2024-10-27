import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import type { TeamListQueryServiceInterface } from "../../application/query-service/team-list-query-service";
import { PostgresqlTeamListQueryService } from "../../infrastructure/query-service/postgresql-team-list-query-service";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    teamListQueryServiceInterface: TeamListQueryServiceInterface;
  };
};

export const getTeamListController = new Hono();

getTeamListController.get(
  "/teams",
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    context.set("teamListQueryServiceInterface", new PostgresqlTeamListQueryService(database));

    await next();
  }),
  async (context) => {
    const payload = await context.var.teamListQueryServiceInterface.invoke();
    if (!payload) {
      return context.text("task not found", 404);
    }
    return context.json(payload);
  },
);
