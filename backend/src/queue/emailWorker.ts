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
      await mailer.sendMail({
        from: `"${from}" contato@alexsandrogomes.dev`,
        to: email,
        subject,
        html,
      });
    },
    {
      connection,
    },
  );

  worker.on("completed", (job) => {
    console.log(`E-mail de recuperação enviado para o job ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    console.log(`Erro ao enviar e-mail do job ${job?.id}: `, err);
  });

  return worker;
};
