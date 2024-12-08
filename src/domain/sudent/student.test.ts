import { describe, expect, it } from "vitest";
import { Student } from "./student";

describe("Student", () => {
  const defaultStudent = new Student({
    id: "student-id",
    email: "student@example.com",
    name: "student-name",
    enrollmentStatus: "参加",
    teamId: null,
  });

  describe("changeEnrollmentStatus", () => {
    describe("生徒がチームに参加していないとき", () => {
      it("参加に変更できること", () => {
        expect(defaultStudent.changeEnrollmentStatus("参加")).toEqual({
          ...defaultStudent,
          enrollmentStatus: "参加",
        });
      });

      it("休会に変更できること", () => {
        expect(defaultStudent.changeEnrollmentStatus("休会")).toEqual({
          ...defaultStudent,
          enrollmentStatus: "休会",
        });
      });

      it("退会に変更できること", () => {
        expect(defaultStudent.changeEnrollmentStatus("退会")).toEqual({
          ...defaultStudent,
          enrollmentStatus: "退会",
        });
      });
    });

    describe("生徒がチームに参加しているとき", () => {
      const student = new Student({
        ...defaultStudent,
        teamId: "team-id",
      });

      it("参加に変更できること", () => {
        expect(student.changeEnrollmentStatus("参加")).toEqual({
          ...student,
          enrollmentStatus: "参加",
        });
      });

      it("休会に変更するとエラーが返ること", () => {
        expect(() => student.changeEnrollmentStatus("休会")).toThrowError(
          "チームに参加している生徒は休会、退会状態に変更できません。",
        );
      });

      it("退会に変更するとエラーが返ること", () => {
        expect(() => student.changeEnrollmentStatus("退会")).toThrowError(
          "チームに参加している生徒は休会、退会状態に変更できません。",
        );
      });
    });
  });
});
