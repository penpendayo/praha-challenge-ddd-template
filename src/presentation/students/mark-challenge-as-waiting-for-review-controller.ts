import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { z } from 'zod';
import { MarkChallengeAsWaitingForReviewUseCase } from '../../application/use-case/mark-challenge-as-waiting-for-review-use-case';
import { PostgresqlChallengeRepository } from '../../infrastructure/repository/postgresql-challenge-repository';
import { getDatabase } from '../../libs/drizzle/get-database';

type Env = {
  Variables: {
    markChallengeAsWaitingForReviewUseCase: MarkChallengeAsWaitingForReviewUseCase;
  };
};

export const markChallengeAsWaitingForReviewController = new Hono();

const markChallengeAsWaitingForReviewUseCaseSchema =  z.object({ 
  studentId: z.string(),
  challengeId: z.string(),
});

markChallengeAsWaitingForReviewController.post(
  '/challenge/waiting-for-review',
  zValidator('json', markChallengeAsWaitingForReviewUseCaseSchema, (result, c) => {
    if (!result.success) {
      return c.text('invalid body', 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const challengeRepository = new PostgresqlChallengeRepository(database);
    context.set('markChallengeAsWaitingForReviewUseCase', new MarkChallengeAsWaitingForReviewUseCase(challengeRepository));

    await next();
  }),
  async (context) => {
    const body = context.req.valid('json');
    const payload = await context.var.markChallengeAsWaitingForReviewUseCase.invoke(body);

    return context.json(payload);
  },
);
