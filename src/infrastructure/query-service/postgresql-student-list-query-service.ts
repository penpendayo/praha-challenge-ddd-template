import type {
  StudentListQueryServiceInterface,
  StudentListQueryServicePayload,
} from "../../application/query-service/students-list-query-service";
import type { Database } from "../../libs/drizzle/get-database";
import { students } from "../../libs/drizzle/schema";

export class PostgresqlStudentListQueryService
  implements StudentListQueryServiceInterface
{
  public constructor(private readonly database: Database) {}

  public async invoke(): Promise<StudentListQueryServicePayload> {
    return await this.database
      .select({
        id: students.id,
        email: students.email,
        enrollmentStatus: students.enrollmentStatus,
        name: students.name,
      })
      .from(students);
  }
}
