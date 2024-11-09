import { eq } from "drizzle-orm";
import {
  Student,
  type StudentParticipantStatus,
} from "../../domain/sudent/student";
import type { StudentRepositoryInterface } from "../../domain/sudent/student-repository";
import type { Database } from "../../libs/drizzle/get-database";
import { students } from "../../libs/drizzle/schema";

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
      })
      .from(students)
      .where(eq(students.id, id));

    const row = rows[0];
    if (!row) {
      return null;
    }

    return new Student({
      email: row.email,
      enrollmentStatus: toEnrollmentStatus(row.enrollmentStatus),
      name: row.name,
      id: row.id,
    });
  }

  public async findByEmail(email: string): Promise<Student | null> {
    const rows = await this.database
      .select({
        id: students.id,
        email: students.email,
        name: students.name,
        enrollmentStatus: students.enrollmentStatus,
      })
      .from(students)
      .where(eq(students.email, email));

    const row = rows[0];
    if (!row) {
      return null;
    }

    return new Student({
      email: row.email,
      enrollmentStatus: toEnrollmentStatus(row.enrollmentStatus),
      name: row.name,
      id: row.id,
    });
  }
}

const toEnrollmentStatusColumn = (
  studentParticipantStatus: StudentParticipantStatus,
) => {
  switch (studentParticipantStatus) {
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
): StudentParticipantStatus => {
  switch (studentParticipantStatus) {
    case 2: {
      return "withdraw";
    }
    case 3: {
      return "leave";
    }
    default:
      throw new Error(`想定しない参加ステータス（すでにチームに加入してたりするかも）: ${studentParticipantStatus}`);
  }
};
