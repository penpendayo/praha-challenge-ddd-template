import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { z } from 'zod';
import { EnrollTeamStudentUseCase } from '../../application/use-case/enroll-team-student-use-case';
import { PostgresqlStudentRepository } from '../../infrastructure/repository/postgresql-student-repository';
import { PostgresqlTeamRepository } from '../../infrastructure/repository/postgresql-team-repository';
import { getDatabase } from '../../libs/drizzle/get-database';

type Env = {
  Variables: {
    enrollTeamStudentUseCase: EnrollTeamStudentUseCase;
  };
};

export const enrollTeamStudentController = new Hono();

const enrollTeamStudentUseCaseSchema =  z.object({ 
  studentId: z.string(),
  teamId: z.string(),
});

enrollTeamStudentController.post(
  '/student/enroll',
  zValidator('json', enrollTeamStudentUseCaseSchema, (result, c) => {
    if (!result.success) {
      return c.text('invalid body', 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const studentRepository = new PostgresqlStudentRepository(database);
    const teamRepository = new PostgresqlTeamRepository(database);
    context.set('enrollTeamStudentUseCase', new EnrollTeamStudentUseCase(studentRepository, teamRepository));

    await next();
  }),
  async (context) => {
    const body = context.req.valid('json');
    const payload = await context.var.enrollTeamStudentUseCase.invoke(body);

    return context.json(payload);
  },
);
