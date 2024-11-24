import type { Notification } from "../../domain/notification/notification";
import type { StudentRepositoryInterface } from "../../domain/sudent/student-repository";
import type { TeamRepositoryInterface } from "../../domain/team/team-repository";

export type RemoveStudentFromTeamUseCaseInput = {
  studentId: string;
  teamId: string;
};

export type RemoveStudentFromTeamUseCasePayload = {
  id: string;
  name: string;
};

export class RemoveStudentFromTeamUseCaseStudentNotFoundError extends Error {
  public override readonly name =
    "RemoveStudentFromTeamUseCaseStudentNotFoundError";

  public constructor() {
    super("student not found");
  }
}

export class RemoveStudentFromTeamUseCaseTeamNotFoundError extends Error {
  public override readonly name =
    "RemoveStudentFromTeamUseCaseTeamNotFoundError";

  public constructor() {
    super("team not found");
  }
}

/**
 * 生徒をチームから外す
 */
export class RemoveStudentFromTeamUseCase {
  public constructor(
    private readonly teamRepo: TeamRepositoryInterface,
    private readonly studentRepo: StudentRepositoryInterface,
    private readonly notification: Notification,
  ) {}

  public async invoke(
    input: RemoveStudentFromTeamUseCaseInput,
  ): Promise<RemoveStudentFromTeamUseCasePayload> {
    // チームを取得する
    const team = await this.teamRepo.findById(input.teamId);
    if (!team) {
      throw new RemoveStudentFromTeamUseCaseTeamNotFoundError();
    }

    // 生徒をチームから外す
    const newTeam = team.removeStudent(input.studentId);

    // 参加者が減ることでチームが2名以下になってしまう場合
    if (newTeam.students.length === 2) {
      // 管理者のメールアドレス（今回の課題ではあなたのメールアドレス）宛にメールを送信する。
      await this.notification.sendEmail({
        to: "admin@example.com",
        subject: "チームの参加者が減りました",
        body: `${newTeam.name}の参加者が減りました。`,
      });
    }

    // 参加者が減ることでチームが1名になってしまう場合
    if (newTeam.students.length === 1) {
      const studentId = newTeam.students[0]?.id;
      if (!studentId) {
        throw new Error("student not found");
      }

      const student = await this.studentRepo.findById(studentId);
      if (!student) {
        throw new Error("student not found");
      }

      // 一番人数が少ないチーム（複数ある場合はランダム）を取得して、一人になってしまった生徒を追加＆保存
      const team = await this.teamRepo.findTheSmallestTeam();
      const addedTeam = team.addStudent(student);
      await this.teamRepo.save(addedTeam);

      // 元のチームから生徒を削除＆保存
      const removedTeam = newTeam.removeStudent(studentId);
      await this.teamRepo.save(removedTeam);
      return {
        id: removedTeam.id,
        name: removedTeam.name,
      };
    }

    const savedTeam = await this.teamRepo.save(newTeam);
    return {
      id: savedTeam.id,
      name: savedTeam.name,
    };
  }
}
