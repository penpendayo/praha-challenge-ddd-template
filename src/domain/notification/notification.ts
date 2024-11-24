export type Notification = {
  sendEmail: (props: {
    to: string;
    subject: string;
    body: string;
  }) => Promise<void>;
};
