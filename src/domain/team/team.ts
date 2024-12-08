import { ulid } from "ulid";
import type { Student } from "../sudent/student";
import type { TeamName } from "./team-name";
import type { TeamStudent } from "./team-student";

/**
 * チーム
 */
export class Team {
  readonly id: string;
  readonly name: TeamName;
  readonly students: TeamStudent[];
  static readonly MAX_MEMBERS = 4;
  static readonly MIN_MEMBERS = 2;

  constructor(props: { id?: string; name: TeamName; students: TeamStudent[] }) {
    this.id = props.id ?? ulid();
    this.name = props.name;
    this.students = props.students;
  }

  /**
   * チームに生徒を追加する
   */
  addStudent(student: Student) {
    const isFull = this.students.length >= Team.MAX_MEMBERS;
    if (isFull) {
      throw new Error(`すでに${Team.MAX_MEMBERS}人いるので追加できません`);
    }

    if (student.teamId) {
      throw new Error("すでにチームに参加している生徒は追加できません");
    }

    return new Team({
      ...this,
      students: [
        ...this.students,
        {
          ...student,
          enrollmentStatus: "参加",
        },
      ],
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
      students: this.students.filter((s) => s.id !== student.id),
    });
  }
}
