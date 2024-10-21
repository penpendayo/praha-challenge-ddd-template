import { Student, type StudentParticipantStatus } from "../../domain/sudent/student";
import type { StudentRepositoryInterface } from "../../domain/sudent/student-repository";

export type CreateStudentUseCaseInput = {
  email: string,
  name: string,
  enrollmentStatus: StudentParticipantStatus
};


export type CreateStudentUseCasePayload = {
  email: string,
  name: string,
  enrollmentStatus: StudentParticipantStatus
};

export class CreateStudentUseCase {
  public constructor(
    private readonly studentRepository: StudentRepositoryInterface,
  ) {}

  public async invoke(
    input: CreateStudentUseCaseInput,
  ): Promise<CreateStudentUseCasePayload> {
    // TODO: 同じメールアドレスを持ったユーザーがいないかチェックする
    
    const student = new Student(input);

    const savedStudent = await this.studentRepository.save(student);

    return {
      email: savedStudent.email,
      name: savedStudent.name,
      enrollmentStatus: savedStudent.enrollmentStatus
    };
  }
}
