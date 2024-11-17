import type { ChallengeStatus } from "../../domain/challenge/challenge";
import type { ChallengeRepositoryInterface } from "../../domain/challenge/challenge-repository";

export type MarkChallengeAsInprogressUseCaseInput = {
  studentId: string;
  challengeId: string;
};

export type MarkChallengeAsInprogressUseCasePayload = {
  id: string;
  name: string;
  status: ChallengeStatus
};

export class MarkChallengeAsInprogressUseCaseChallengeNotFoundError extends Error {
  public override readonly name = "MarkChallengeAsInprogressUseCaseChallengeNotFoundError";

  public constructor() {
    super("challenge not found");
  }
}

/**
 * 指定した生徒のある課題の進捗を「進行中」に変更する
 */
export class MarkChallengeAsInprogressUseCase {
  public constructor(
    private readonly challengeRepo: ChallengeRepositoryInterface,
  ) {}

  public async invoke(
    input: MarkChallengeAsInprogressUseCaseInput,
  ): Promise<MarkChallengeAsInprogressUseCasePayload> {
    const challenge = await this.challengeRepo.findByIdAndStudentId(input);
    if (!challenge) {
      throw new MarkChallengeAsInprogressUseCaseChallengeNotFoundError();
    }

    const updatedChallenge = challenge.markInProgress(input.studentId);
    await this.challengeRepo.save(updatedChallenge);

    return {
      id: updatedChallenge.id,
      name: updatedChallenge.name,
      status: updatedChallenge.status
    };
  }
}
