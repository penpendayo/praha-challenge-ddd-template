import type { Challenge } from "./challenge";

export type ChallengeRepositoryInterface = {
  findByIdAndStudentId: (props: {
    studentId: string;
    challengeId: string;
  }) => Promise<Challenge | undefined>;
  save: (Challenge: Challenge) => Promise<Challenge>;
};
