import { ulid } from "ulid";

// NOTE: leaveかwithdrawにした場合、repositoryへの保存時にチームから外れる
export type TeamStudentParticipantStatus = "enrollment" | "leave" | "withdraw";

/**
 * チームに所属している生徒
 */
export class TeamStudent {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly enrollmentStatus: TeamStudentParticipantStatus;

  constructor(props: {
    id?: string;
    email: string;
    name: string;
    enrollmentStatus: TeamStudentParticipantStatus;
  }) {
    this.id = props.id ?? ulid();
    this.email = props.email;
    this.name = props.name;
    this.enrollmentStatus = props.enrollmentStatus;
  }

  /**
   * 参加ステータスを変更する
   */
  changeEnrollmentStatus(status: TeamStudentParticipantStatus) {
    return new TeamStudent({
      ...this,
      enrollmentStatus: status,
    });
  }
}
