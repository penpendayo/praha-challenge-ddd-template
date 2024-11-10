import { ulid } from "ulid";

export type ChallengeStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "WAITING_FOR_REVIEW"
  | "COMPLETED";

/**
 * 課題
 */
export class Challenge {
  readonly id: string;
  readonly name: string;
  readonly status: ChallengeStatus;
  readonly studentId: string;

  constructor(props: { id?: string; name: string; status: ChallengeStatus, studentId: string }) {
    this.id = props.id ?? ulid();
    this.name = props.name;
    this.status = props.status;
    this.studentId = props.studentId;
  }

  /**
   * ステータスを "IN_PROGRESS" に変更する
   */
  markInProgress(operatingStudentId: string) {
    this.#ensureOwnership(operatingStudentId);

    if(this.status === "NOT_STARTED" || this.status === "WAITING_FOR_REVIEW") {
      return new Challenge({
        ...this,
        status: "IN_PROGRESS",
      });
    }

    throw new Error("WAITING_FOR_REVIEWかNOT_STARTEDの課題のみ、IN_PROGRESSに変更できます");
  }

  /**
   * ステータスを "WAITING_FOR_REVIEW" に変更する
   */
  markWaitingForReview(operatingStudentId: string) {
    this.#ensureOwnership(operatingStudentId);

    if(this.status === "IN_PROGRESS") {
      return new Challenge({
        ...this,
        status: "WAITING_FOR_REVIEW",
      });
    }

    throw new Error("IN_PROGRESSの課題のみ、WAITING_FOR_REVIEWに変更できます");
  }

  /**
   * ステータスを "COMPLETED" に変更する
   */
  markCompleted(operatingStudentId: string) {
    this.#ensureOwnership(operatingStudentId);

    if(this.status === "WAITING_FOR_REVIEW") {
      return new Challenge({
        ...this,
        status: "COMPLETED",
      });
    }

    throw new Error("WAITING_FOR_REVIEWの課題のみ、COMPLETEDに変更できます");
  }

  /**
   * その課題の所有者かどうか
   */
    #ensureOwnership(operatingStudentId: string): void {
      if (this.studentId !== operatingStudentId) {
        throw new Error("この課題を変更する権限がありません");
      }
    }
}