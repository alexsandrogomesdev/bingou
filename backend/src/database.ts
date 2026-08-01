import { Pool, QueryResult, QueryResultRow } from "pg";

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

export const query = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[],
): Promise<QueryResult<T>> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;

  console.log(`Query executed at:`, {
    duration: `${duration}ms`,
    rows: res.rowCount,
  });

  return res;
};

pool.connect((err, client, release) => {
  if (err) return console.error("Failed to connect to PostegreSQL:", err.stack);
  console.log("Connected to PostgreSQL!");
  release();
});
