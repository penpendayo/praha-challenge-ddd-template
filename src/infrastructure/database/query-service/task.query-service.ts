import { eq } from "drizzle-orm";
import { getDatabase } from "../../../libs/drizzle/get-database";
import { tasks } from "../../../libs/drizzle/schema";
import type { TaskQueryServiceInterface } from "../../../query-service/task.query-service";

export const taskQueryService: TaskQueryServiceInterface = async (id) => {
  const database = getDatabase();

  const [data] = await database
    .select({
      id: tasks.id,
      title: tasks.title,
      done: tasks.done,
    })
    .from(tasks)
    .where(eq(tasks.id, id));

  return data;
};