import Fastify from "fastify";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, // max clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = async <T = any>(
  text: string,
  params?: any[],
): Promise<T[]> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;

  console.log(`Query executed at:`, {
    duration: `${duration}ms`,
    rows: res.rowCount,
  });

  return res.rows;
};

pool.connect((err, client, release) => {
  if (err) return console.error("Failed to connect to PostegreSQL:", err.stack);
  console.log("Connected to PostgreSQL!");
  release();
});

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async () => {
  interface Users {
    name: string;
  }
  const teste = await query<Users>("SELECT * FROM users");
  teste.forEach((item) => {
    console.log(item.name.padStart(15, "*"));
  });
  return { status: "ok", message: teste };
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
