import { describe, expect, it } from "vitest";
import { Challenge } from "./challenge";

describe("Challenge", () => {
  const defaultChallenge = new Challenge({
    title: "challenge-title",
    status: "未着手",
    studentId: "student-id",
  });

  describe("markInProgress", () => {
    describe("ステータスが「未着手」の場合", () => {
      it("ステータスが「進行中」に変更されること", () => {
        expect(defaultChallenge.markInProgress("student-id")).toEqual({
          ...defaultChallenge,
          status: "進行中",
        });
      });
    });

    describe("ステータスが「レビュー待ち」の場合", () => {
      const challenge = new Challenge({
        ...defaultChallenge,
        status: "レビュー待ち",
      });

      it("ステータスが「進行中」に変更されること", () => {
        expect(challenge.markInProgress("student-id")).toEqual({
          ...challenge,
          status: "進行中",
        });
      });
    });

    describe("ステータスが「進行中」の場合", () => {
      const challenge = new Challenge({
        ...defaultChallenge,
        status: "進行中",
      });

      it("エラーが返ること", () => {
        expect(() => challenge.markInProgress("student-id")).toThrowError(
          "「未着手」または「レビュー待ち」の課題のみ、「進行中」に変更できます",
        );
      });
    });

    describe("ステータスが「完了」の場合", () => {
      const challenge = new Challenge({
        ...defaultChallenge,
        status: "完了",
      });

      it("エラーが返ること", () => {
        expect(() => challenge.markInProgress("student-id")).toThrowError(
          "「未着手」または「レビュー待ち」の課題のみ、「進行中」に変更できます",
        );
      });
    });
  });

  describe("所有者以外がステータスを変更しようとした場合", () => {
    it("エラーが返ること", () => {
      expect(() =>
        defaultChallenge.markInProgress("other-student-id"),
      ).toThrowError("課題の所有者のみがステータスを変更できます");
    });
  });

  // TODO: 今度やる（たぶんやらない）
  describe.todo("markAsWaitingForReview");
  describe.todo("markAsCompleted");
});
