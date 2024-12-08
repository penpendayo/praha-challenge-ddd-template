import type { StudentRepositoryInterface } from "../../domain/sudent/student-repository";
import type { TeamRepositoryInterface } from "../../domain/team/team-repository";

export type AddTeamStudentUseCaseInput = {
  studentId: string;
  teamId: string;
};

export type AddTeamStudentUseCasePayload = {
  id: string;
  name: string;
};

export class AddTeamStudentUseCaseStudentNotFoundError extends Error {
  public override readonly name = "AddTeamStudentUseCaseStudentNotFoundError";

  public constructor() {
    super("生徒が見つかりません");
  }
}

export class AddTeamStudentUseCaseStudentAlreadyInTeamError extends Error {
  public override readonly name =
    "AddTeamStudentUseCaseStudentAlreadyInTeamError";

  public constructor() {
    super("生徒がすでにチームに加入しています");
  }
}

export class AddTeamStudentUseCaseTeamNotFoundError extends Error {
  public override readonly name = "AddTeamStudentUseCaseTeamNotFoundError";

  public constructor() {
    super("チームが見つかりません");
  }
}

/**
 * 生徒をチームに追加する
 */
export class AddTeamStudentUseCase {
  public constructor(
    private readonly studentRepository: StudentRepositoryInterface,
    private readonly teamRepo: TeamRepositoryInterface,
  ) {}

  public async invoke(
    input: AddTeamStudentUseCaseInput,
  ): Promise<AddTeamStudentUseCasePayload> {
    // 生徒を取得する
    const student = await this.studentRepository.findById(input.studentId);
    if (!student) {
      throw new AddTeamStudentUseCaseStudentNotFoundError();
    }

    // 追加するチームを取得する
    const team = await this.teamRepo.findById(input.teamId);
    if (!team) {
      throw new AddTeamStudentUseCaseTeamNotFoundError();
    }

    // 生徒をチームに追加して保存する
    const newTeam = team.addStudent(student);
    const savedTeam = await this.teamRepo.save(newTeam);

    return {
      id: savedTeam.id,
      name: savedTeam.name,
    };
  }
}
