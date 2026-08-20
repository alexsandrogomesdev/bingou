import { createEmailWorker } from "./queue/emailWorker";

console.log("Email Worker started and waiting for jobs...");

const worker = createEmailWorker();

const gracefulShutdown = async (signal: string) => {
  console.log(`[Worker] Recebido ${signal}. closing queues...`);
  await worker.close();
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
