import {
  Student,
  type StudentParticipantStatus,
} from "../../domain/sudent/student";
import type { StudentRepositoryInterface } from "../../domain/sudent/student-repository";

export type CreateStudentUseCaseInput =
  | {
      email: string;
      name: string;
      enrollmentStatus: "leave" | "withdraw" | "enrollment";
      teamId: null;
    }
  | {
      email: string;
      name: string;
      enrollmentStatus: "enrollment";
      teamId: string;
    };

export type CreateStudentUseCasePayload = {
  email: string;
  name: string;
  enrollmentStatus: StudentParticipantStatus;
};

export class CreateStudentUseCase {
  public constructor(
    private readonly studentRepository: StudentRepositoryInterface,
  ) {}

  public async invoke(
    input: CreateStudentUseCaseInput,
  ): Promise<CreateStudentUseCasePayload> {
    const existStudent = await this.studentRepository.findByEmail(input.email);
    if (existStudent) {
      throw new Error("同じメールアドレスを持った生徒が存在します");
    }

    const student = new Student(input);

    const savedStudent = await this.studentRepository.save(student);

    return {
      email: savedStudent.email,
      name: savedStudent.name,
      enrollmentStatus: savedStudent.enrollmentStatus,
    };
  }
}
