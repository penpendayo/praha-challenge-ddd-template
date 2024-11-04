import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { z } from 'zod';
import { WithdrawTeamStudentUseCase } from '../../application/use-case/withdraw-team-student-use-case copy';
import { PostgresqlTeamRepository } from '../../infrastructure/repository/postgresql-team-repository';
import { getDatabase } from '../../libs/drizzle/get-database';

type Env = {
  Variables: {
    withdrawTeamStudentUseCase: WithdrawTeamStudentUseCase;
  };
};

export const withdrawTeamStudentController = new Hono();

const withdrawTeamStudentUseCaseSchema =  z.object({ 
  studentId: z.string(),
  teamId: z.string(),
});

withdrawTeamStudentController.post(
  '/student/widhdraw',
  zValidator('json', withdrawTeamStudentUseCaseSchema, (result, c) => {
    if (!result.success) {
      return c.text('invalid body', 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const teamRepository = new PostgresqlTeamRepository(database);
    context.set('withdrawTeamStudentUseCase', new WithdrawTeamStudentUseCase(teamRepository));

    await next();
  }),
  async (context) => {
    const body = context.req.valid('json');
    const payload = await context.var.withdrawTeamStudentUseCase.invoke(body);

    return context.json(payload);
  },
);
