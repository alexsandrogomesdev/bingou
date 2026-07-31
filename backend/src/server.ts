import Fastify from "fastify";
import { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import bcrypt from "bcryptjs";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";

// FUNCTIONS
const authenticate = async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({
      message: "Não autorizado.",
    });
  }
};

// DATABASE
import { pool, query } from "./database";

// FASTIFY
const fastify = Fastify({
  logger: true,
});

interface ResponseStatus {
  text: string;
  code: number;
}
const responseStatus: ResponseStatus = {
  text: "ok",
  code: 200,
};

// ROUTES
// GET
interface UserParams {
  id: string;
}
fastify.get(
  "/user/:id",
  { preHandler: [authenticate] },
  async (
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;

    interface User {
      name: string;
      document: string;
      email: string;
      phone: string;
      starts_at: number;
      due_at: number;
      status: number;
    }
    const result = await query<User>(
      "SELECT name,document,email,phone,starts_at,due_at,status FROM users WHERE id = $1",
      [id],
    );
    return reply.status(responseStatus.code).send({
      message: responseStatus.text,
      result: result,
    });
  },
);

interface Packs {
  user_id: number;
}
fastify.get(
  "/user/:user_id/packs",
  { preHandler: [authenticate] },
  async (request: FastifyRequest<{ Params: Packs }>, reply: FastifyReply) => {
    const { user_id } = request.params;
    const result = await query("SELECT * FROM packs WHERE user_id = $1", [
      user_id,
    ]);

    return reply.status(200).send({
      message: "ok",
      result: result,
    });
  },
);

// POST
interface CreateUser {
  name: string;
  document: string;
  phone: string;
  email: string;
  password: string;
}
fastify.post(
  "/user",
  async (
    request: FastifyRequest<{ Body: CreateUser }>,
    reply: FastifyReply,
  ) => {
    const { name, document, phone, email, password } = request.body;
    const time = Math.floor(Date.now() / 1000);

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      "INSERT INTO users (name, document, phone, email, password, starts_at, due_at, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id",
      [
        name,
        document,
        phone,
        email,
        passwordHash,
        time, // start_at
        time, // due_at
        1, // status
        time, // created_at
      ],
    );

    if (result.length > 0) {
      responseStatus.code = 201;
    } else {
      responseStatus.text = "failed";
      responseStatus.code = 401;
    }

    return reply.status(responseStatus.code).send({
      message: responseStatus.text,
    });
  },
);

interface SignInBody {
  email: string;
  password: string;
}
fastify.post(
  "/signin",
  async (
    request: FastifyRequest<{ Body: SignInBody }>,
    reply: FastifyReply,
  ) => {
    const { email, password } = request.body;

    const result = await query(
      "SELECT id,name,email,password FROM users WHERE email = $1 LIMIT 1",
      [email],
    );

    if (result.length === 0) {
      return reply.status(401).send({
        message: "Email ou senha inválidos",
      });
    }

    interface UserSignIn {
      id: number;
      name: string;
      email: string;
      password: string;
    }
    const user: UserSignIn = result[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({
        message: "Email ou senha inválidos",
      });
    }

    // CREATE JWT TOKEN
    const token = fastify.jwt.sign(
      { name: user.name, email: user.email },
      { sub: user.id.toString(), expiresIn: "7d" },
    );

    return reply
      .setCookie("token", token, {
        path: "/", // all routes
        secure: false, // https
        httpOnly: true, // XSS attacks protection
        sameSite: "lax", // CSRF attacks protection
        maxAge: 7 * 24 * 60 * 60, // expire in 7 days
      })
      .status(200)
      .send({
        message: "ok",
      });
  },
);

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: ["http://localhost:5173", "http://192.168.100.15:5173"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    });

    await fastify.register(fastifyCookie);

    await fastify.register(fastifyJwt, {
      secret: process.env.JWT_SECRET,
      cookie: {
        cookieName: "token",
        signed: false,
      },
    });

    await fastify.listen({ port: 3001, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
