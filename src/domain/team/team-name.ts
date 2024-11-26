import { z } from "zod";

const teamNameSchema = z
  .string()
  .regex(/^[A-Za-z]+$/, "チーム名は英文字のみで入力してください")
  .brand("TeamName");

export type TeamName = z.infer<typeof teamNameSchema>;

export const TeamName = (teamName: string) => teamNameSchema.parse(teamName);
