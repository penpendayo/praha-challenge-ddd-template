import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { addTeamStudentController } from "./presentation/mutation/add-team-student-controller";
import { createStudentListController } from "./presentation/mutation/create-student-controller";
import { enrollStudentController } from "./presentation/mutation/enroll-student-controller";
import { leaveStudentController } from "./presentation/mutation/leave-student-controller";
import { markChallengeAsCompletedController } from "./presentation/mutation/mark-challenge-as-completed-controller";
import { markChallengeAsInprogressController } from "./presentation/mutation/mark-challenge-as-inprogress-controller";
import { markChallengeAsWaitingForReviewController } from "./presentation/mutation/mark-challenge-as-waiting-for-review-controller";
import { removeTeamStudentController } from "./presentation/mutation/remove-team-student-controller";
import { withdrawStudentController } from "./presentation/mutation/withdraw-student-controller";
import { getStudentListController } from "./presentation/query/get-student-list-controller";
import { getTeamListController } from "./presentation/query/get-team-list-controller";

const app = new Hono();

app.route("/", addTeamStudentController);
app.route("/", createStudentListController);
app.route("/", enrollStudentController);
app.route("/", getStudentListController);
app.route("/", getTeamListController);
app.route("/", leaveStudentController);
app.route("/", markChallengeAsCompletedController);
app.route("/", markChallengeAsInprogressController);
app.route("/", markChallengeAsWaitingForReviewController);
app.route("/", markChallengeAsWaitingForReviewController);
app.route("/", removeTeamStudentController);
app.route("/", withdrawStudentController);

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
