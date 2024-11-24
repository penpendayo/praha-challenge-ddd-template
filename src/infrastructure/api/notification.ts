import type { Notification } from "../../domain/notification/notification";

export const notification: Notification = {
  sendEmail: async ({ to, subject, body }) => {
    // TODO: メール送信を実装する（でも面倒くさいので実装しない）。
    console.log(to, subject, body);
  },
};
