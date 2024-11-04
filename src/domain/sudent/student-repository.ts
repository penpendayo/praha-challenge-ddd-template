import type { Student } from "./student";

export type StudentRepositoryInterface = {
  save: (student: Student) => Promise<Student>;
  findById: (id: string) => Promise<Student|null>;
};
