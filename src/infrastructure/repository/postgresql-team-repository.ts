
import { eq } from "drizzle-orm";
import { Team } from "../../domain/team/team";
import { TeamName } from "../../domain/team/team-name";
import type { TeamRepositoryInterface } from "../../domain/team/team-repository";
import {
  TeamStudent,
  type TeamStudentParticipantStatus,
} from "../../domain/team/team-student";
import type { Database } from "../../libs/drizzle/get-database";
import { students, teams } from "../../libs/drizzle/schema";

export class PostgresqlTeamRepository implements TeamRepositoryInterface {
  public constructor(private readonly database: Database) {}

  public async save(team: Team): Promise<Team> {
    await this.database.transaction(async (tx) => {
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

      await Promise.all(
        team.students.map((student) => {
          return tx
            .update(students)
            .set({
              id: student.id,
              name: student.name,
              email: student.email,
              enrollmentStatus: toEnrollmentStatusColumn(
                student.enrollmentStatus,
              ),
              teamId:
                student.enrollmentStatus === "enrollment" ? team.id : null,
            })
            .where(eq(students.id, student.id));
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
      students: rows.flatMap(({ student }) => {
        if (!student) return [];
        return new TeamStudent({
          id: student.id,
          name: student.name,
          email: student.email,
          enrollmentStatus: toEnrollmentStatus(student.enrollmentStatus),
        });
      }),
    });
  }
}

const toEnrollmentStatusColumn = (
  studentParticipantStatus: TeamStudentParticipantStatus,
) => {
  switch (studentParticipantStatus) {
    case "enrollment": {
      return 1;
    }
    case "withdraw": {
      return 2;
    }
    case "leave": {
      return 3;
    }
  }
};

const toEnrollmentStatus = (
  studentParticipantStatus: number,
): TeamStudentParticipantStatus => {
  switch (studentParticipantStatus) {
    case 1: {
      return "enrollment";
    }
    case 2: {
      return "withdraw";
    }
    case 3: {
      return "leave";
    }
    default:
      throw new Error(`想定しない参加ステータス: ${studentParticipantStatus}`);
  }
};