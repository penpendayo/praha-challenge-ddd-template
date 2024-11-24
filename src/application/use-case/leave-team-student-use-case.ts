import type { TeamRepositoryInterface } from "../../domain/team/team-repository";

export type LeaveTeamStudentUseCaseInput = {
  studentId: string;
  teamId: string;
};

export type LeaveTeamStudentUseCasePayload = {
  id: string;
  name: string;
};

export class LeaveTeamStudentUseCaseStudentNotFoundError extends Error {
  public override readonly name = "LeaveTeamStudentUseCaseStudentNotFoundError";

  public constructor() {
    super("student not found");
  }
}

export class LeaveTeamStudentUseCaseTeamNotFoundError extends Error {
  public override readonly name = "LeaveTeamStudentUseCaseTeamNotFoundError";

  public constructor() {
    super("team not found");
  }
}

/**
 * 生徒をチームから外す
 */
export class LeaveTeamStudentUseCase {
  public constructor(
    private readonly teamRepo: TeamRepositoryInterface,
  ) {}

  public async invoke(
    input: LeaveTeamStudentUseCaseInput,
  ): Promise<LeaveTeamStudentUseCasePayload> {
    // チームを取得する
    const team = await this.teamRepo.findById(input.teamId);
    if (!team) {
      throw new LeaveTeamStudentUseCaseTeamNotFoundError();
    }

    // 生徒を休会状態にして、チームから外す
    const newTeam = team.removeStudent(input.studentId);
    const savedTeam = await this.teamRepo.save(newTeam);

    if (savedTeam.students.length === 2) {
      // TODO: 参加者が減ることでチームが2名以下になってしまう場合、管理者のメールアドレス（今回の課題ではあなたのメールアドレス）宛にメールを送信する。
    }
    if (savedTeam.students.length === 1) {
      // TODO: 参加者が減ることでチームが1名になってしまう場合、残った参加者を自動的に他のチームに合流させる
    }

    return {
      id: savedTeam.id,
      name: savedTeam.name,
    };
  }
}
