import type { Team } from "./team";

export type TeamRepositoryInterface = {
  save: (Team: Team) => Promise<Team>;
  findById: (teamId: string) => Promise<Team|null>;
  findByStudentId: (studentId: string) => Promise<Team|null>;
};
