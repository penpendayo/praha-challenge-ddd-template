import { eq } from "drizzle-orm";
import type {} from "../../application/query-service/students-list-query-service";
import type {
  TeamListQueryServiceInterface,
  TeamListQueryServicePayload,
} from "../../application/query-service/team-list-query-service";
import type { Database } from "../../libs/drizzle/get-database";
import { students, teams } from "../../libs/drizzle/schema";

export class PostgresqlTeamListQueryService
  implements TeamListQueryServiceInterface
{
  public constructor(private readonly database: Database) {}

  public async invoke(): Promise<TeamListQueryServicePayload> {
    const rows = await this.database
      .select({
        id: teams.id,
        name: teams.name,
        student: {
          id: students.id,
          name: students.name,
        },
      })
      .from(teams)
      .innerJoin(students, eq(teams.id, students.teamId));

    // studentsの配列に加工する処理（面倒くさいのでChatGPTに書いてもらったのでテキトー）
    return rows.reduce(
      (acc, row) => {
        const team =
          acc.find((t) => t.id === row.id) ||
          (() => {
            const newTeam = {
              id: row.id,
              name: row.name,
              students: [],
            };
            acc.push(newTeam);
            return newTeam;
          })();

        if (row.student?.id) {
          team.students.push({
            id: row.student.id,
            name: row.student.name,
          });
        }

        return acc;
      },
      [] as {
        id: string;
        name: string;
        students: { id: string; name: string }[];
      }[],
    );
  }
}
