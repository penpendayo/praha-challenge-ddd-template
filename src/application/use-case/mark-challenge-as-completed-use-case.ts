import type { ChallengeStatus } from "../../domain/challenge/challenge";
import type { ChallengeRepositoryInterface } from "../../domain/challenge/challenge-repository";

export type MarkChallengeAsCompletedUseCaseInput = {
  studentId: string;
  challengeId: string;
};

export type MarkChallengeAsCompletedUseCasePayload = {
  id: string;
  name: string;
  status: ChallengeStatus
};

export class MarkChallengeAsCompletedUseCaseChallengeNotFoundError extends Error {
  public override readonly name = "MarkChallengeAsCompletedUseCaseChallengeNotFoundError";

  public constructor() {
    super("課題が見つかりません");
  }
}

/**
 * 指定した生徒のある課題の進捗を「完了」に変更する
 */
export class MarkChallengeAsCompletedUseCase {
  public constructor(
    private readonly challengeRepo: ChallengeRepositoryInterface,
  ) {}

  public async invoke(
    input: MarkChallengeAsCompletedUseCaseInput,
  ): Promise<MarkChallengeAsCompletedUseCasePayload> {
    const challenge = await this.challengeRepo.findByIdAndStudentId(input);
    if (!challenge) {
      throw new MarkChallengeAsCompletedUseCaseChallengeNotFoundError();
    }

    const updatedChallenge = challenge.markCompleted(input.studentId);
    await this.challengeRepo.save(updatedChallenge);

    return {
      id: updatedChallenge.id,
      name: updatedChallenge.name,
      status: updatedChallenge.status
    };
  }
}
