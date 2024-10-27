export type TeamListQueryServicePayload = {
  id: string;
  name: string;
  students: {
    id: string;
    name: string;
  }[]
}[];

export interface TeamListQueryServiceInterface {
  invoke: () => Promise<TeamListQueryServicePayload>;
}
