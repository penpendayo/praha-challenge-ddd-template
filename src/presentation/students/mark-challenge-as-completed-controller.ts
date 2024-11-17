import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { z } from 'zod';
import { MarkChallengeAsCompletedUseCase } from '../../application/use-case/mark-challenge-as-completed-use-case';
import { PostgresqlChallengeRepository } from '../../infrastructure/repository/postgresql-challenge-repository';
import { getDatabase } from '../../libs/drizzle/get-database';

type Env = {
  Variables: {
    markChallengeAsCompletedUseCase: MarkChallengeAsCompletedUseCase;
  };
};

export const markChallengeAsCompletedController = new Hono();

const markChallengeAsCompletedUseCaseSchema =  z.object({ 
  studentId: z.string(),
  challengeId: z.string(),
});

markChallengeAsCompletedController.post(
  '/challenge/complete',
  zValidator('json', markChallengeAsCompletedUseCaseSchema, (result, c) => {
    if (!result.success) {
      return c.text('invalid body', 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const challengeRepository = new PostgresqlChallengeRepository(database);
    context.set('markChallengeAsCompletedUseCase', new MarkChallengeAsCompletedUseCase(challengeRepository));

    await next();
  }),
  async (context) => {
    const body = context.req.valid('json');
    const payload = await context.var.markChallengeAsCompletedUseCase.invoke(body);

    return context.json(payload);
  },
);
