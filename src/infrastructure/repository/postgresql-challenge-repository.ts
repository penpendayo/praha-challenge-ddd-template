
import { and, eq } from "drizzle-orm";
import {
  Challenge,
  type ChallengeStatus,
} from "../../domain/challenge/challenge";
import type { ChallengeRepositoryInterface } from "../../domain/challenge/challenge-repository";
import type { Database } from "../../libs/drizzle/get-database";
import { challenges, studentsToChallenges } from "../../libs/drizzle/schema";

export class PostgresqlChallengeRepository
  implements ChallengeRepositoryInterface
{
  public constructor(private readonly database: Database) {}

  public async findByIdAndStudentId({
    studentId,
    challengeId,
  }: { studentId: string; challengeId: string }): Promise<
    Challenge | undefined
  > {
    const rows = await this.database
      .select({
        challenge: {
          id: challenges.id,
          name: challenges.name,
          status: studentsToChallenges.status,
        },
        studentId: studentsToChallenges.studentId,
      })
      .from(studentsToChallenges)
      .innerJoin(
        challenges,
        eq(challenges.id, studentsToChallenges.challengeId),
      )
      .where(
        and(
          eq(studentsToChallenges.studentId, studentId),
          eq(studentsToChallenges.challengeId, challengeId),
        ),
      );

    const row = rows[0];
    if (!row) {
      return;
    }

    return new Challenge({
      id: row.challenge.id,
      name: row.challenge.name,
      studentId: row.studentId,
      status: fromChallengeStatusColumn(row.challenge.status),
    });
  }

  public async save(challenge: Challenge): Promise<Challenge> {
    await this.database.transaction(async (tx) => {
      await tx
        .insert(challenges)
        .values({
          id: challenge.id,
          name: challenge.name,
        })
        .onConflictDoUpdate({
          target: challenges.id,
          set: {
            name: challenge.name,
          },
        });

      await tx
        .insert(studentsToChallenges)
        .values({
          studentId: challenge.studentId,
          challengeId: challenge.id,
          status: toChallengeStatusColumn(challenge.status),
        })
        .onConflictDoUpdate({
          target: [
            studentsToChallenges.studentId,
            studentsToChallenges.challengeId,
          ],
          set: {
            status: toChallengeStatusColumn(challenge.status),
          },
        });
    });

    return challenge;
  }
}

const toChallengeStatusColumn = (challengeStatus: ChallengeStatus) => {
  switch (challengeStatus) {
    case "未着手": {
      return 0;
    }
    case "進行中": {
      return 1;
    }
    case "レビュー待ち": {
      return 2;
    }
    case "完了": {
      return 3;
    }
  }
};

const fromChallengeStatusColumn = (
  challengeStatus: number,
): ChallengeStatus => {
  switch (challengeStatus) {
    case 0: {
      return "未着手";
    }
    case 1: {
      return "進行中";
    }
    case 2: {
      return "レビュー待ち";
    }
    case 3: {
      return "完了";
    }
    default: {
      throw new Error(`未知の課題ステータス: ${challengeStatus}`);
    }
  }
};
