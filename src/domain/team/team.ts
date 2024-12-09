import { ulid } from "ulid";
import type { Student } from "../sudent/student";
import type { TeamName } from "./team-name";

/**
 * チーム
 */
export class Team {
  readonly id: string;
  readonly name: TeamName;
  readonly studentIds: string[];
  static readonly MAX_MEMBERS = 4;
  static readonly MIN_MEMBERS = 2;

  constructor(props: { id?: string; name: TeamName; studentIds: string[] }) {
    this.id = props.id ?? ulid();
    this.name = props.name;
    this.studentIds = props.studentIds;
  }

  /**
   * チームに生徒を追加する
   */
  addStudent(student: Student) {
    const isFull = this.studentIds.length >= Team.MAX_MEMBERS;
    if (isFull) {
      throw new Error(`すでに${Team.MAX_MEMBERS}人いるので追加できません`);
    }

    if (student.teamId) {
      throw new Error("すでにチームに参加している生徒は追加できません");
    }

    return new Team({
      ...this,
      studentIds: [...this.studentIds, student.id],
    });
  }

  /**
   * チームから生徒を外す
   */
  removeStudent(student: Student) {
    if (student.teamId !== this.id) {
      throw new Error("チームに参加していない生徒は外すことができません");
    }

    return new Team({
      ...this,
      studentIds: this.studentIds.filter((id) => id !== student.id),
    });
  }
}
