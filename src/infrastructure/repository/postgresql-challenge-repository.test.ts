import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { beforeAll, describe, expect, inject, it } from "vitest";
import { Challenge } from "../../domain/challenge/challenge";
import * as schema from "../../libs/drizzle/schema";
import { PostgresqlChallengeRepository } from "./postgresql-challenge-repository";

describe("PostgreSQLChallengeRepository", async () => {
  const database = drizzle(postgres(inject("connection")), { schema });

  beforeAll(async () => {
    await database.insert(schema.students).values({
      id: "1",
      name: "test",
      email: "test@test.com",
      enrollmentStatus: 1,
    });
  });

  const repository = new PostgresqlChallengeRepository(database);

  it("save", async () => {
    const challenge = new Challenge({
      title: "test",
      status: "未着手",
      studentId: "1",
    });
    await repository.save(challenge);

    const challenges = await database.select().from(schema.challenges);
    const studentsToChallenges = await database
      .select()
      .from(schema.studentsToChallenges);

    expect(challenges).toEqual([
      {
        name: "test",
        id: challenge.id,
      },
    ]);
    expect(studentsToChallenges).toEqual([
      expect.objectContaining({
        studentId: "1",
        challengeId: challenge.id,
      }),
    ]);
  });

  it("findByIdAndStudentId", async () => {
    await database.insert(schema.challenges).values({
      id: "1",
      name: "test",
    });
    await database.insert(schema.studentsToChallenges).values({
      studentId: "1",
      challengeId: "1",
      status: 1,
    });

    const result = await repository.findByIdAndStudentId({
      challengeId: "1",
      studentId: "1",
    });

    expect(result).toEqual(
      new Challenge({
        id: "1",
        title: "test",
        status: "進行中",
        studentId: "1",
      }),
    );
  });
});
