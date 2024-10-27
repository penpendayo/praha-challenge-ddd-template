import { ulid } from 'ulid'

export type StudentParticipantStatus = 'leave' | 'withdraw' | 'enrollment';

export class Student {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly enrollmentStatus: StudentParticipantStatus;

  constructor(props: { id?: string, email: string; name: string; enrollmentStatus: StudentParticipantStatus }) {
    this.id = props.id ?? ulid();
    this.email = props.email;
    this.name = props.name;
    this.enrollmentStatus = props.enrollmentStatus
  }

  changeParticipantStatus(enrollmentStatus: StudentParticipantStatus) {
    return new Student({ ...this, enrollmentStatus });
  }
}
