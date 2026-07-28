import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async () => {
  return { status: "ok", message: "Fastify Server Running!" };
});
fastify.get("/packs/:id", async () => {
  return { status: "ok", message: "Packs from user!" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
