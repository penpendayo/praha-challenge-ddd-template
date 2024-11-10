import type { Challenge } from "./challenge";

export type ChallengeRepositoryInterface = {
  save: (Challenge: Challenge) => Promise<Challenge>;
};
