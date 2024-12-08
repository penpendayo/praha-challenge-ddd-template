import { and, eq, gt } from "drizzle-orm";
import type {
  StudentListByChallengeIdAndChallengeStatusQueryServiceInterface,
  StudentListByChallengeIdAndChallengeStatusQueryServicePayload,
} from "../../application/query-service/students-list-by-challenge-id-and-chellenge-status-query-service";
import type { ChallengeStatus } from "../../domain/challenge/challenge";
import type { Database } from "../../libs/drizzle/get-database";
import { students, studentsToChallenges } from "../../libs/drizzle/schema";

export class PostgresqlStudentListByChallengeIdAndChallengeStatusQueryService
  implements StudentListByChallengeIdAndChallengeStatusQueryServiceInterface
{
  public constructor(private readonly database: Database) {}

  public async invoke({
    challengeId,
    challengeStatus,
    after,
    limit,
  }: {
    challengeId: string;
    challengeStatus: ChallengeStatus;
    after?: string | undefined;
    limit?: number | undefined;
  }): Promise<StudentListByChallengeIdAndChallengeStatusQueryServicePayload> {
    const filters: Parameters<typeof and> = [];
    if (after) {
      filters.push(gt(studentsToChallenges.studentId, after)); // NOTE: Studentのid(ULID)でカーソルページネーションしてる
    }

    const rows = await this.database
      .select({
        id: students.id,
        email: students.email,
        name: students.name,
      })
      .from(studentsToChallenges)
      .innerJoin(students, eq(students.id, studentsToChallenges.studentId))
      .where(
        and(
          eq(studentsToChallenges.challengeId, challengeId),
          eq(
            studentsToChallenges.status,
            toChallengeStatusColumn(challengeStatus),
          ),
          ...filters,
        ),
      )
      .limit(limit ? (limit > 100 ? 100 : limit) : 10);

    return {
      // @ts-expect-error: rows[rows.length - 1]は必ず存在する
      after: rows[rows.length - 1].id,
      students: rows.map((row) => {
        return {
          id: row.id,
          email: row.email,
          name: row.name,
        };
      }),
    };
  }
}

const toChallengeStatusColumn = (challengeStatus: ChallengeStatus): number => {
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
    default: {
      throw new Error(`Unexpected challenge status: ${challengeStatus}`);
    }
  }
};
