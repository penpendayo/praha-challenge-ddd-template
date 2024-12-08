import type { StudentRepositoryInterface } from "../../domain/sudent/student-repository";

export type LeaveStudentUseCaseInput = {
  studentId: string;
};

export type LeaveStudentUseCasePayload = {
  id: string;
  name: string;
};

export class LeaveStudentUseCaseStudentNotFoundError extends Error {
  public override readonly name =
    "LeaveStudentUseCaseStudentNotFoundError";

  public constructor() {
    super("生徒が見つかりません");
  }
}

/**
 * 生徒のステータスを「休会」にする
 */
export class LeaveStudentUseCase {
  public constructor(
    private readonly studentRepo: StudentRepositoryInterface,
  ) {}

  public async invoke(
    input: LeaveStudentUseCaseInput,
  ): Promise<LeaveStudentUseCasePayload> {
    const student = await this.studentRepo.findById(input.studentId);
    if (!student) {
      throw new LeaveStudentUseCaseStudentNotFoundError();
    }

    const updatedStudent = student.changeEnrollmentStatus("休会");
    await this.studentRepo.save(updatedStudent);
    
    return {
      id: updatedStudent.id,
      name: updatedStudent.name,
    };
  }
}
