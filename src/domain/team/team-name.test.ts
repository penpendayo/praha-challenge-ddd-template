import { describe, expect, test } from "vitest";
import { TeamName } from "./team-name";

describe("teamName", () => {
  test("英文字のとき、パースに成功する", () => {
    expect(TeamName("a")).toBe("a");
    expect(TeamName("B")).toBe("B");
    expect(TeamName("CCCCCC")).toBe("CCCCCC");
  });

  test("英文字以外のとき、パースに失敗する", () => {
    expect(() => TeamName("あ")).toThrowError();
    expect(() => TeamName("😭")).toThrowError();
    expect(() => TeamName("亜")).toThrowError();
    expect(() => TeamName("ア")).toThrowError();
  });
});
