import type { Student, StudentParticipantStatus } from "../../domain/sudent/student";
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
}

const toEnrollmentStatusColumn = (studentParticipantStatus: StudentParticipantStatus) => {
  switch (studentParticipantStatus) {
    case 'enrollment': {
      return 1;
    }
    case 'withdraw': {
      return 2;
    }
    case 'leave': {
      return 3;
    }
  }
};
