import { ulid } from "ulid";

export type StudentParticipantStatus = "leave" | "withdraw";

/**
 * チームに所属していない生徒
 */
export class Student {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly enrollmentStatus: StudentParticipantStatus;

  constructor(props: {
    id?: string;
    email: string;
    name: string;
    enrollmentStatus: StudentParticipantStatus;
  }) {
    this.id = props.id ?? ulid();
    this.email = props.email;
    this.name = props.name;
    this.enrollmentStatus = props.enrollmentStatus;
  }
}
