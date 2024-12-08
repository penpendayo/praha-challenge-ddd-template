import type { StudentRepositoryInterface } from "../../domain/sudent/student-repository";

export type WithdrawStudentUseCaseInput = {
  studentId: string;
};

export type WithdrawStudentUseCasePayload = {
  id: string;
  name: string;
};

export class WithdrawStudentUseCaseStudentNotFoundError extends Error {
  public override readonly name =
    "WithdrawStudentUseCaseStudentNotFoundError";

  public constructor() {
    super("生徒が見つかりません");
  }
}

/**
 * 生徒のステータスを「退会」にする
 */
export class WithdrawStudentUseCase {
  public constructor(
    private readonly studentRepo: StudentRepositoryInterface,
  ) {}

  public async invoke(
    input: WithdrawStudentUseCaseInput,
  ): Promise<WithdrawStudentUseCasePayload> {
    const student = await this.studentRepo.findById(input.studentId);
    if (!student) {
      throw new WithdrawStudentUseCaseStudentNotFoundError();
    }

    const updatedStudent = student.changeEnrollmentStatus("退会");
    await this.studentRepo.save(updatedStudent);
    
    return {
      id: updatedStudent.id,
      name: updatedStudent.name,
    };
  }
}
