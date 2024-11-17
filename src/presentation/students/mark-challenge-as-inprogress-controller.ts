import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { z } from 'zod';
import { MarkChallengeAsInprogressUseCase } from '../../application/use-case/mark-challenge-as-inprogress-use-case';
import { PostgresqlChallengeRepository } from '../../infrastructure/repository/postgresql-challenge-repository';
import { getDatabase } from '../../libs/drizzle/get-database';

type Env = {
  Variables: {
    markChallengeAsInprogressUseCase: MarkChallengeAsInprogressUseCase;
  };
};

export const markChallengeAsInprogressController = new Hono();

const markChallengeAsInprogressUseCaseSchema =  z.object({ 
  studentId: z.string(),
  challengeId: z.string(),
});

markChallengeAsInprogressController.post(
  '/challenge/inprogress',
  zValidator('json', markChallengeAsInprogressUseCaseSchema, (result, c) => {
    if (!result.success) {
      return c.text('invalid body', 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const challengeRepository = new PostgresqlChallengeRepository(database);
    context.set('markChallengeAsInprogressUseCase', new MarkChallengeAsInprogressUseCase(challengeRepository));

    await next();
  }),
  async (context) => {
    const body = context.req.valid('json');
    const payload = await context.var.markChallengeAsInprogressUseCase.invoke(body);

    return context.json(payload);
  },
);
