import type { StudentRepositoryInterface } from "../../domain/sudent/student-repository";

export type EnrollStudentUseCaseInput = {
  studentId: string;
};

export type EnrollStudentUseCasePayload = {
  id: string;
  name: string;
};

export class EnrollStudentUseCaseStudentNotFoundError extends Error {
  public override readonly name =
    "EnrollStudentUseCaseStudentNotFoundError";

  public constructor() {
    super("生徒が見つかりません");
  }
}

/**
 * 生徒のステータスを「参加」にする
 */
export class EnrollStudentUseCase {
  public constructor(
    private readonly studentRepo: StudentRepositoryInterface,
  ) {}

  public async invoke(
    input: EnrollStudentUseCaseInput,
  ): Promise<EnrollStudentUseCasePayload> {
    const student = await this.studentRepo.findById(input.studentId);
    if (!student) {
      throw new EnrollStudentUseCaseStudentNotFoundError();
    }

    const updatedStudent = student.changeEnrollmentStatus("参加");
    await this.studentRepo.save(updatedStudent);
    
    return {
      id: updatedStudent.id,
      name: updatedStudent.name,
    };
  }
}
