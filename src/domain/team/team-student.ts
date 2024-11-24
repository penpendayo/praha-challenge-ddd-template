import { ulid } from "ulid";

export type TeamStudentParticipantStatus = "enrollment";

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
}
