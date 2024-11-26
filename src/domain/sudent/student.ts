import { ulid } from "ulid";

export type StudentEnrollmentStatus = "参加" | "休会" | "退会";

/**
 * 生徒
 */
export class Student {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly enrollmentStatus: StudentEnrollmentStatus;
  readonly teamId: string | null;

  constructor(
    props:
      | {
          id?: string;
          email: string;
          name: string;
          enrollmentStatus: "休会" | "退会" | "参加";
          teamId: null;
        }
      | {
          id?: string;
          email: string;
          name: string;
          enrollmentStatus: "参加";
          teamId: string;
        },
  ) {
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
