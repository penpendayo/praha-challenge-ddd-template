import { ulid } from "ulid";
import { z } from "zod";

export const studentEnrollmentStatusSchema = z.enum(["参加", "休会", "退会"]);

export type StudentEnrollmentStatus = z.infer<typeof studentEnrollmentStatusSchema>;


export const studentSchema = z.union([
  z.object({
    id: z.string().optional(),
    email: z.string().email(),
    name: z.string(),
    enrollmentStatus: studentEnrollmentStatusSchema,
    teamId: z.string().nullable(),
  }),
  z.object({
    id: z.string().optional(),
    email: z.string().email(),
    name: z.string(),
    enrollmentStatus: z.enum(["参加"]),
    teamId: z.string(),
  }),
]);

export type StudentConstructorProps = z.infer<typeof studentSchema>;

/**
 * 生徒
 */
export class Student {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly enrollmentStatus: StudentEnrollmentStatus;
  readonly teamId: string | null;

  constructor(props: StudentConstructorProps) {
    this.id = props.id ?? ulid();
    this.email = props.email;
    this.name = props.name;
    this.enrollmentStatus = props.enrollmentStatus;
    this.teamId = props.teamId;
  }

  /**
   * 参加状態を変更する
   */
  changeEnrollmentStatus(status: StudentEnrollmentStatus) {
    switch (status) {
      case "参加":
        return new Student({
          ...this,
          enrollmentStatus: status,
        });
      case "休会":
      case "退会":
        if (this.teamId) {
          throw new Error(
            "チームに参加している生徒は休会、退会状態に変更できません。",
          );
        }
        return new Student({
          ...this,
          teamId: null,
          enrollmentStatus: status,
        });
    }
  }
}
