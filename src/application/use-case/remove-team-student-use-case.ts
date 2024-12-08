import type { Notification } from "../../domain/notification/notification";
import type { StudentRepositoryInterface } from "../../domain/sudent/student-repository";
import type { TeamRepositoryInterface } from "../../domain/team/team-repository";

export type RemoveTeamStudentUseCaseInput = {
  studentId: string;
  teamId: string;
};

export type RemoveTeamStudentUseCasePayload = {
  id: string;
  name: string;
};

export class RemoveTeamStudentUseCaseStudentNotFoundError extends Error {
  public override readonly name =
    "RemoveTeamStudentUseCaseStudentNotFoundError";

  public constructor() {
    super("生徒が見つかりません");
  }
}

export class RemoveTeamStudentUseCaseTeamNotFoundError extends Error {
  public override readonly name = "RemoveTeamStudentUseCaseTeamNotFoundError";

  public constructor() {
    super("チームが見つかりません");
  }
}

export class RemoveTeamStudentUseCaseStudentNotInTeamError extends Error {
  public override readonly name = "RemoveTeamStudentUseCaseTeamNotFoundError";

  public constructor() {
    super("チームに生徒が所属していません");
  }
}

/**
 * 生徒をチームから外す
 */
export class RemoveTeamStudentUseCase {
  public constructor(
    private readonly teamRepo: TeamRepositoryInterface,
    private readonly studentRepo: StudentRepositoryInterface,
    private readonly notification: Notification,
  ) {}

  public async invoke(
    input: RemoveTeamStudentUseCaseInput,
  ): Promise<RemoveTeamStudentUseCasePayload> {
    // チームを取得する
    const team = await this.teamRepo.findById(input.teamId);
    if (!team) {
      throw new RemoveTeamStudentUseCaseTeamNotFoundError();
    }

    // チームに生徒が所属しているか確認する
    const isExistStudent = team.students.some(
      (student) => student.id === input.studentId,
    );
    if (!isExistStudent) {
      throw new RemoveTeamStudentUseCaseStudentNotInTeamError();
    }

    // 生徒をチームから外す
    const newTeam = team.removeStudent(input.studentId);
    await this.teamRepo.save(newTeam);

    switch (newTeam.students.length) {
      // 参加者が減ることでチームが1名になってしまう場合、もっとも人数が少ないチーム（複数ある場合はランダム）を取得して、1人になってしまった生徒をそのチームに追加する
      case 1: {
        const student = await this.studentRepo.findById(
          // biome-ignore lint/style/noNonNullAssertion: 必ず生徒が存在する
          newTeam.students[0]!.id,
        );

        if (!student) {
          throw new RemoveTeamStudentUseCaseStudentNotFoundError();
        }

        const team = await this.teamRepo.findTheSmallestTeam();
        const addedTeam = team.addStudent(student);
        await this.teamRepo.save(addedTeam);

        const removedTeam = newTeam.removeStudent(student.id);
        await this.teamRepo.save(removedTeam);
        return {
          id: removedTeam.id,
          name: removedTeam.name,
        };
      }

      // 参加者が減ることでチームが2名以下になってしまう場合、管理者のメールアドレス宛にメールを送信する。
      case 2: {
        await this.notification.sendEmail({
          to: "admin@example.com",
          subject: "チームの参加者が減りました",
          body: `${newTeam.name}の参加者が減りました。`,
        });
        break;
      }

      // それ以外の場合、何もしない
      default: {
        break;
      }
    }

    return {
      id: newTeam.id,
      name: newTeam.name,
    };
  }
}
