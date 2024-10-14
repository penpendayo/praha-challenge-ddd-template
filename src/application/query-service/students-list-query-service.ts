export type StudentListQueryServicePayload = {
  id: string;
  email: string;
  name: string;
  enrollmentStatus: number;
}[];

export interface StudentListQueryServiceInterface {
  invoke: () => Promise<StudentListQueryServicePayload>;
}
