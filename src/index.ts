import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { createTaskController } from "./presentation/task/create-task-controller";
import { editTaskTitleController } from "./presentation/task/edit-task-title-controller";
import { getTaskController } from "./presentation/task/get-task-controller";
import { getTaskListController } from "./presentation/task/get-task-list-controller";
import { setTaskDoneController } from "./presentation/task/set-task-done-controller";
import { getStudentListController } from "./presentation/students/get-student-list-controller";
import { getTeamListController } from "./presentation/students/get-team-list-controller";
import { enrollTeamStudentController } from "./presentation/students/enroll-team-student-controller";
import { leaveTeamStudentController } from "./presentation/students/leave-team-student-controller";

const app = new Hono();

app.route("/", getStudentListController);
app.route("/", getTaskController);
app.route("/", getTaskListController);
app.route("/", getTeamListController);
app.route("/", createTaskController);
app.route("/", editTaskTitleController);
app.route("/", enrollTeamStudentController);
app.route("/", leaveTeamStudentController);
app.route("/", setTaskDoneController);
app.route("/", withDra);

const port = 3000;
console.log(`Server is running on port ${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

if (import.meta.hot) {
  // HMR時に同一ポートでサーバーが立ち上がろうとする為、リロードが発生する前にサーバーを閉じる
  import.meta.hot.on("vite:beforeFullReload", () => {
    server.close();
  });
}
