import { eq } from "drizzle-orm";
import {
  Student,
  type StudentEnrollmentStatus,
} from "../../domain/sudent/student";
import type { StudentRepositoryInterface } from "../../domain/sudent/student-repository";
import type { Database } from "../../libs/drizzle/get-database";
import { students, teams } from "../../libs/drizzle/schema";

export class PostgresqlStudentRepository implements StudentRepositoryInterface {
  public constructor(private readonly database: Database) {}

  public async save(student: Student): Promise<Student> {
    await this.database
      .insert(students)
      .values({
        id: student.id,
        email: student.email,
        name: student.name,
        enrollmentStatus: toEnrollmentStatusColumn(student.enrollmentStatus),
      })
      .onConflictDoUpdate({
        target: students.id,
        set: {
          email: student.email,
          name: student.name,
          enrollmentStatus: toEnrollmentStatusColumn(student.enrollmentStatus),
        },
      });
    return student;
  }

  public async findById(id: string): Promise<Student | null> {
    const rows = await this.database
      .select({
        id: students.id,
        email: students.email,
        name: students.name,
        enrollmentStatus: students.enrollmentStatus,
        teamId: teams.id,
      })
      .from(students)
      .leftJoin(teams, eq(teams.id, students.teamId))
      .where(eq(students.id, id));

    const row = rows[0];
    if (!row) {
      return null;
    }

    const status = toEnrollmentStatus(row.enrollmentStatus);
    if (!row.teamId) {
      return new Student({
        email: row.email,
        enrollmentStatus: status,
        name: row.name,
        id: row.id,
        teamId: null,
      });
    }

    if (status === "参加") {
      return new Student({
        email: row.email,
        enrollmentStatus: status,
        name: row.name,
        id: row.id,
        teamId: row.teamId,
      });
    }

    throw new Error("想定しない参加ステータスです。");
  }

  public async findByEmail(email: string): Promise<Student | null> {
    const rows = await this.database
      .select({
        id: students.id,
        email: students.email,
        name: students.name,
        enrollmentStatus: students.enrollmentStatus,
        teamId: teams.id,
      })
      .from(students)
      .leftJoin(teams, eq(teams.id, students.teamId))
      .where(eq(students.email, email));

    const row = rows[0];
    if (!row) {
      return null;
    }

    const status = toEnrollmentStatus(row.enrollmentStatus);
    if (!row.teamId) {
      return new Student({
        email: row.email,
        enrollmentStatus: status,
        name: row.name,
        id: row.id,
        teamId: null,
      });
    }

    if (status === "参加") {
      return new Student({
        email: row.email,
        enrollmentStatus: status,
        name: row.name,
        id: row.id,
        teamId: row.teamId,
      });
    }

    throw new Error("想定しない参加ステータスです。");
  }
}

const toEnrollmentStatusColumn = (
  studentEnrollmentStatus: StudentEnrollmentStatus,
) => {
  switch (studentEnrollmentStatus) {
    case "参加": {
      return 1;
    }
    case "退会": {
      return 2;
    }
    case "休会": {
      return 3;
    }
  }
};

const toEnrollmentStatus = (
  studentEnrollmentStatus: number,
): StudentEnrollmentStatus => {
  switch (studentEnrollmentStatus) {
    case 1: {
      return "参加";
    }
    case 2: {
      return "退会";
    }
    case 3: {
      return "休会";
    }
    default:
      throw new Error(
        `想定しない参加ステータスです: ${studentEnrollmentStatus}`,
      );
  }
};
