import { describe, expect, it } from "vitest";
import { Student } from "../sudent/student";
import { Team } from "./team";
import { TeamName } from "./team-name";

describe("Team", () => {
  const defaultTeam = new Team({
    id: "team-id",
    name: TeamName("A"),
    studentIds: [],
  });

  const defaultStudent = new Student({
    id: "student-id-1",
    email: "student@example.com",
    name: "student-name",
    enrollmentStatus: "参加",
    teamId: null,
  });

  describe("addStudent", () => {
    describe("追加する生徒がチームに加入していないとき", () => {
      it("生徒が追加されること", () => {
        expect(defaultTeam.addStudent(defaultStudent)).toEqual({
          ...defaultTeam,
          studentIds: ["student-id-1"],
        });
      });

      describe("追加する生徒がすでにチームに加入していたとき", () => {
        it("エラーになること", () => {
          const student = new Student({
            ...defaultStudent,
            teamId: "team-id",
          });

          expect(() => defaultTeam.addStudent(student)).toThrowError(
            "すでにチームに参加している生徒は追加できません",
          );
        });
      });
    });

    describe("チームの人数がすでにMAX_MEMBERSに達しているとき", () => {
      it("エラーになること", () => {
        const team = new Team({
          ...defaultTeam,
          studentIds: [
            "student-id-1",
            "student-id-2",
            "student-id-3",
            "student-id-4",
          ],
        });

        expect(() => team.addStudent(defaultStudent)).toThrowError(
          "すでに4人いるので追加できません",
        );
      });
    });
  });

  describe("removeStudent", () => {
    describe("チームに所属している生徒を外すとき", () => {
      it("生徒がチームから外れること", () => {
        const student = new Student({
          ...defaultStudent,
          teamId: "team-id",
        });

        const team = new Team({
          ...defaultTeam,
          studentIds: ["student-id-1"],
        });

        expect(team.removeStudent(student)).toEqual({
          ...team,
          studentIds: [],
        });
      });
    });

    describe("チームに参加していない生徒を外すとき", () => {
      it("エラーになること", () => {
        expect(() => defaultTeam.removeStudent(defaultStudent)).toThrowError(
          "チームに参加していない生徒は外すことができません",
        );
      });
    });
  });
});
