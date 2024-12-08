import type { ChallengeStatus } from "../../domain/challenge/challenge";

export type StudentListByChallengeIdAndChallengeStatusQueryServicePayload = {
  after: string;
  students: {
    id: string;
    email: string;
    name: string;
  };
}[];

export interface StudentListByChallengeIdAndChallengeStatusQueryServiceInterface {
  invoke: ({
    challengeId,
    challengeStatus,
    after,
    limit,
  }: {
    challengeId: string;
    challengeStatus: ChallengeStatus;
    after?: string | undefined;
    limit?: number | undefined;
  }) => Promise<StudentListByChallengeIdAndChallengeStatusQueryServicePayload>;
}
