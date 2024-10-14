export class Student {
  readonly email: string;
  readonly name: string;
  readonly participantStatus: "leave" | "withdraw" | "enrollment";

  constructor(props: { email: string; name: string; participantStatus: "leave" | "withdraw" | "enrollment" }) {
    this.email = props.email;
    this.name = props.name;
    this.participantStatus = props.participantStatus
  }

  changeParticipantStatus(participantStatus: "leave" | "withdraw" | "enrollment") {
    return new Student({ ...this, participantStatus });
  }
}
