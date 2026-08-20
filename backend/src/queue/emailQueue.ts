import { Queue } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT),
};

export const emailQueue = new Queue("emailSendQueue", { connection });
