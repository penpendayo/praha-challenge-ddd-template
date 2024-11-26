import { ulid } from "ulid";

export type ChallengeStatus = "未着手" | "進行中" | "レビュー待ち" | "完了";

/**
 * 課題
 */
export class Challenge {
  readonly id: string;
  readonly title: string;
  readonly status: ChallengeStatus;
  readonly studentId: string;

  constructor(props: {
    id?: string;
    title: string;
    status: ChallengeStatus;
    studentId: string;
  }) {
    this.id = props.id ?? ulid();
    this.title = props.title;
    this.status = props.status;
    this.studentId = props.studentId;
  }

  /**
   * ステータスを「進行中」に変更する
   */
  markInProgress(operatingStudentId: string) {
    this.#ensureOwnership(operatingStudentId);

    if (this.status === "未着手" || this.status === "レビュー待ち") {
      return new Challenge({
        ...this,
        status: "進行中",
      });
    }

    throw new Error(
      "「未着手」または「レビュー待ち」の課題のみ、「進行中」に変更できます",
    );
  }

  /**
   * ステータスを「レビュー待ち」に変更する
   */
  markWaitingForReview(operatingStudentId: string) {
    this.#ensureOwnership(operatingStudentId);

    if (this.status === "進行中") {
      return new Challenge({
        ...this,
        status: "レビュー待ち",
      });
    }

    throw new Error("「進行中」の課題のみ、「レビュー待ち」に変更できます");
  }

  /**
   * ステータスを「完了」に変更する
   */
  markCompleted(operatingStudentId: string) {
    this.#ensureOwnership(operatingStudentId);

    if (this.status === "レビュー待ち") {
      return new Challenge({
        ...this,
        status: "完了",
      });
    }

    throw new Error("「レビュー待ち」の課題のみ、「完了」に変更できます");
  }

  /**
   * その課題の所有者かどうか確認する
   */
  #ensureOwnership(operatingStudentId: string): void {
    if (this.studentId !== operatingStudentId) {
      throw new Error("この課題を変更する権限がありません");
    }
  }
}
