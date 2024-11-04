import type { StudentRepositoryInterface } from "../../domain/sudent/student-repository";
import type { TeamRepositoryInterface } from "../../domain/team/team-repository";

export type EnrollTeamStudentUseCaseInput = {
  studentId: string;
  teamId: string;
};

export type EnrollTeamStudentUseCasePayload = {
  id: string;
  name: string;
};

export class EnrollTeamStudentUseCaseStudentNotFoundError extends Error {
  public override readonly name =
    "EnrollTeamStudentUseCaseStudentNotFoundError";

  public constructor() {
    super("student not found");
  }
}

export class EnrollTeamStudentUseCaseTeamNotFoundError extends Error {
  public override readonly name = "EnrollTeamStudentUseCaseTeamNotFoundError";

  public constructor() {
    super("team not found");
  }
}

/**
 * 生徒をチームに追加する
 */
export class EnrollTeamStudentUseCase {
  public constructor(
    private readonly studentRepository: StudentRepositoryInterface,
    private readonly teamRepo: TeamRepositoryInterface,
  ) {}

  public async invoke(
    input: EnrollTeamStudentUseCaseInput,
  ): Promise<EnrollTeamStudentUseCasePayload> {
    // 生徒を取得する
    const student = await this.studentRepository.findById(input.studentId);
    if (!student) {
      throw new EnrollTeamStudentUseCaseStudentNotFoundError();
    }

    // 指定した生徒が、すでにチームに所属している場合はエラーにする
    const existTeam = await this.teamRepo.findByStudentId(student.id);
    if (existTeam) {
      throw new Error("this student is already enrolled in a team");
    }

    // 追加するチームが存在するか確認する
    const team = await this.teamRepo.findById(input.teamId);
    if (!team) {
      throw new EnrollTeamStudentUseCaseTeamNotFoundError();
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
