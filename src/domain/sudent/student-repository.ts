import type { Student } from "./student";

export type StudentRepositoryInterface = {
  save: (task: Student) => Promise<Student>;
};
