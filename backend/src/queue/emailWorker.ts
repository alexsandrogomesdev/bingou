import { Worker } from "bullmq";
import { mailer } from "../config/mail";

const connection = {
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT),
};

export const createEmailWorker = () => {
  const worker = new Worker(
    "emailSendQueue",
    async (job) => {
      const { email, from, subject, html } = job.data;

      console.log(
        `[${new Date().toLocaleString("pr-BR")}] Sending email to: ${email}`,
      );

      await mailer.sendMail({
        from: `"${from}" ${process.env.SMTP_USER}`,
        to: email,
        subject,
        html,
      });

      console.log(
        `[${new Date().toLocaleString("pr-BR")}] email sent to: ${email}`,
      );
    },
    {
      connection,
      concurrency: 5,
    },
  );

  worker.on("active", (job) => {
    console.log(
      `${new Date().toLocaleString("pt-BR")} [Queue] Job ${job.id} is being proccessed...`,
    );
  });

  worker.on("completed", (job) => {
    console.log(
      `${new Date().toLocaleString("pt-BR")} Job completed ${job.id}`,
    );
  });

  worker.on("failed", (job, err) => {
    console.log(
      `${new Date().toLocaleString("pt-BR")} Job failed ${job?.id}: `,
      err,
    );
  });

  return worker;
};
