import type { ChallengeStatus } from "../../domain/challenge/challenge";
import type { ChallengeRepositoryInterface } from "../../domain/challenge/challenge-repository";

export type MarkChallengeAsWaitingForReviewUseCaseInput = {
  studentId: string;
  challengeId: string;
};

export type MarkChallengeAsWaitingForReviewUseCasePayload = {
  id: string;
  name: string;
  status: ChallengeStatus
};

export class MarkChallengeAsWaitingForReviewUseCaseChallengeNotFoundError extends Error {
  public override readonly name = "MarkChallengeAsWaitingForReviewUseCaseChallengeNotFoundError";

  public constructor() {
    super("課題が見つかりません");
  }
}

/**
 * 指定した生徒のある課題の進捗を「レビュー待ち」に変更する
 */
export class MarkChallengeAsWaitingForReviewUseCase {
  public constructor(
    private readonly challengeRepo: ChallengeRepositoryInterface,
  ) {}

  public async invoke(
    input: MarkChallengeAsWaitingForReviewUseCaseInput,
  ): Promise<MarkChallengeAsWaitingForReviewUseCasePayload> {
    const challenge = await this.challengeRepo.findByIdAndStudentId(input);
    if (!challenge) {
      throw new MarkChallengeAsWaitingForReviewUseCaseChallengeNotFoundError();
    }

    const updatedChallenge = challenge.markWaitingForReview(input.studentId);
    await this.challengeRepo.save(updatedChallenge);

    return {
      id: updatedChallenge.id,
      name: updatedChallenge.name,
      status: updatedChallenge.status
    };
  }
}
