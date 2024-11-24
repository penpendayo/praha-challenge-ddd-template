import { ulid } from "ulid";

export type StudentParticipantStatus = "enrollment" | "leave" | "withdraw";

/**
 * 生徒
 */
export class Student {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly enrollmentStatus: StudentParticipantStatus;
  readonly teamId: string | null;

  constructor(
    props:
      | {
          id?: string;
          email: string;
          name: string;
          enrollmentStatus: "leave" | "withdraw" | "enrollment";
          teamId: null;
        }
      | {
          id?: string;
          email: string;
          name: string;
          enrollmentStatus: "enrollment";
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
  changeEnrollmentStatus(status: StudentParticipantStatus) {
    switch (status) {
      case "enrollment":
        return new Student({
          ...this,
          enrollmentStatus: status,
        });
      case "leave":
      case "withdraw":
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
