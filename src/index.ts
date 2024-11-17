import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { enrollTeamStudentController } from "./presentation/students/enroll-team-student-controller";
import { getStudentListController } from "./presentation/students/get-student-list-controller";
import { getTeamListController } from "./presentation/students/get-team-list-controller";
import { leaveTeamStudentController } from "./presentation/students/leave-team-student-controller";
import { markChallengeAsInprogressController } from "./presentation/students/mark-challenge-as-inprogress-controller";
import { withdrawTeamStudentController } from "./presentation/students/withdraw-team-student-controller";

const app = new Hono();

app.route("/", getStudentListController);
app.route("/", getTeamListController);
app.route("/", enrollTeamStudentController);
app.route("/", leaveTeamStudentController);
app.route("/", markChallengeAsInprogressController);
app.route("/", withdrawTeamStudentController);

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
