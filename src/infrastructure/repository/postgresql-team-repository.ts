import { eq, inArray, sql } from "drizzle-orm";
import { Team } from "../../domain/team/team";
import { TeamName } from "../../domain/team/team-name";
import type { TeamRepositoryInterface } from "../../domain/team/team-repository";
import type { Database } from "../../libs/drizzle/get-database";
import { students, teams } from "../../libs/drizzle/schema";

export class PostgresqlTeamRepository implements TeamRepositoryInterface {
  public constructor(private readonly database: Database) {}

  public async save(team: Team): Promise<Team> {
    await this.database.transaction(async (tx) => {
      // チームの基本情報の更新
      await tx
        .insert(teams)
        .values({
          id: team.id,
          name: team.name,
        })
        .onConflictDoUpdate({
          target: teams.id,
          set: {
            name: team.name,
          },
        });

      // チームに所属している生徒を取得する
      const studentsInTeam = await tx
        .select({
          id: students.id,
          name: students.name,
          email: students.email,
          enrollmentStatus: students.enrollmentStatus,
        })
        .from(students)
        .innerJoin(teams, eq(teams.id, students.teamId))
        .where(eq(teams.id, team.id));

      //チームから外れた生徒IDを取得する
      const studentIdsToRemove = team.studentIds.filter((id) => {
        return !studentsInTeam.some((studentInTeam) => studentInTeam.id === id);
      });

      // チームから外れた生徒を外す
      await tx
        .update(students)
        .set({
          teamId: null,
        })
        .where(inArray(students.id, studentIdsToRemove));

      // チームに参加している生徒を更新する
      await Promise.all(
        team.studentIds.map((id) => {
          return tx
            .update(students)
            .set({
              id,
              teamId: team.id,
            })
            .where(eq(students.id, id));
        }),
      );
    });

    return team;
  }

  public async findById(teamId: string): Promise<Team | null> {
    const rows = await this.database
      .select({
        team: {
          id: teams.id,
          name: teams.name,
        },
        student: {
          id: students.id,
          name: students.name,
          email: students.email,
          enrollmentStatus: students.enrollmentStatus,
        },
      })
      .from(teams)
      .leftJoin(students, eq(teams.id, students.teamId))
      .where(eq(teams.id, teamId));

    const row = rows[0];
    if (!row) {
      return null;
    }

    return new Team({
      id: row.team.id,
      name: TeamName(row.team.name),
      studentIds: rows.flatMap(({ student }) => {
        if (!student) return [];
        return student.id;
      }),
    });
  }

  /**
   * 人数が最小のチームを取得する（最小の数が同じチームが複数ある場合はランダムで取得する）
   */
  public async findTheSmallestTeam(): Promise<Team> {
    const [team] = await this.database
      .select({
        id: teams.id,
        name: teams.name,
        studentCount: sql<number>`count(${students.id})`.as("student_count"),
      })
      .from(teams)
      .leftJoin(students, eq(teams.id, students.teamId))
      .groupBy(teams.id)
      .orderBy(sql`student_count`)
      //TODO: 最小の数が同じチームが複数ある場合はランダムで取得するべきだけど、面倒くさいのでとりあえずこれで取得してる
      .limit(1);

    if (!team) {
      throw new Error("チームが存在しません");
    }

    const rows = await this.database
      .select({
        team: {
          id: teams.id,
          name: teams.name,
        },
        student: {
          id: students.id,
        },
      })
      .from(teams)
      .leftJoin(students, eq(teams.id, students.teamId))
      .where(eq(teams.id, team.id));

    return new Team({
      id: team.id,
      name: TeamName(team.name),
      studentIds: rows.flatMap(({ student }) => {
        if (!student) return [];
        return student.id;
      }),
    });
  }
}
