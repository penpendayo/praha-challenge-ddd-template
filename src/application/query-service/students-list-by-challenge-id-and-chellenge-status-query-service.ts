import type { ChallengeStatus } from "../../domain/challenge/challenge";

export type StudentListByChallengeIdAndChallengeStatusQueryServicePayload = {
  cursor: string;
  students: {
    id: string;
    email: string;
    name: string;
  }[];
};

export interface StudentListByChallengeIdAndChallengeStatusQueryServiceInterface {
  invoke: ({
    challengeId,
    challengeStatus,
    cursor,
    limit,
  }: {
    challengeId: string;
    challengeStatus: ChallengeStatus;
    cursor?: string | undefined;
    limit?: number | undefined;
  }) => Promise<StudentListByChallengeIdAndChallengeStatusQueryServicePayload>;
}
