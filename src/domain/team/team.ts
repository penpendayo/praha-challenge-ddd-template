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
   * チームに所属している参加中の生徒数を返す
   */
  get countOfEnrollmentStudents() {
    return this.students.filter(
      (student) => student.enrollmentStatus === "enrollment",
    ).length;
  }

  /**
   * チームに生徒を追加する
   */
  addStudent(student: Student) {
    const canAddStudent = this.countOfEnrollmentStudents < Team.MAX_MEMBERS;
    if (!canAddStudent) {
      throw new Error("すでに4人いるので追加できません");
    }

    return new Team({
      ...this,
      students: [
        ...this.students,
        {
          ...student,
          enrollmentStatus: "enrollment",
        },
      ],
    });
  }

  /**
   * チームにいる生徒を退会にする
   */
  leaveStudent(studentId: string) {
    return new Team({
      ...this,
      students: this.students.map((student) => {
        if (student.id === studentId) {
          return student.changeEnrollmentStatus("leave");
        }
        return student;
      }),
    });
  }

  /**
   * チームにいる生徒を休会にする
   */
  withDrawStudent(studentId: string) {
    return new Team({
      ...this,
      students: this.students.map((student) => {
        if (student.id === studentId) {
          return student.changeEnrollmentStatus("withdraw");
        }
        return student;
      }),
    });
  }
}
