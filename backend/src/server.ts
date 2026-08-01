import Fastify from "fastify";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import bcrypt from "bcryptjs";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      sub: string;
    };
  }
}

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

// GLOBALS
import { modalities } from "./modalities";
import { shuffleArray, getRandomNumber } from "./utils";
import { createCardNumbers } from "./functions/createCardNumbers";

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
fastify.get(
  "/modalities",
  { preHandler: [authenticate] },
  async (request: FastifyRequest, reply: FastifyReply) => {
    const id = request.user.sub;
    if (!id) {
      return reply.status(401).send({
        message: "Não autorizado!",
      });
    }

    return reply.status(200).send({
      message: "ok",
      result: modalities,
    });
  },
);

fastify.get(
  "/user",
  { preHandler: [authenticate] },
  async (request: FastifyRequest<{}>, reply: FastifyReply) => {
    const id = request.user.sub;

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
      result: result.rows[0],
    });
  },
);

// POST
interface CreateUserBody {
  name: string;
  document: string;
  phone: string;
  email: string;
  password: string;
}
fastify.post(
  "/user/signup",
  async (
    request: FastifyRequest<{ Body: CreateUserBody }>,
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

    if (result.rowCount && result.rowCount > 0) {
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
  "/user/signin",
  async (
    request: FastifyRequest<{ Body: SignInBody }>,
    reply: FastifyReply,
  ) => {
    const { email, password } = request.body;

    const result = await query(
      "SELECT id,name,email,password FROM users WHERE email = $1 LIMIT 1",
      [email],
    );

    if (!result.rowCount || result.rowCount === 0) {
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
    const user: UserSignIn = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({
        message: "Email ou senha inválidos",
      });
    }

    // CREATE JWT TOKEN
    const token = await reply.jwtSign(
      { name: user.name, email: user.email },
      { sub: user.id.toString(), expiresIn: "7d" },
    );

    return reply
      .setCookie("token", token, {
        path: "/", // all routes
        secure: process.env.NODE_ENV === "production", // https
        httpOnly: true, // XSS attacks protection
        sameSite: "lax", // CSRF attacks protection
        maxAge: 7 * 24 * 60 * 60, // expire in 7 days
      })
      .setCookie("userId", user.id.toString(), {
        path: "/", // all routes
        secure: process.env.NODE_ENV === "production", // https
        httpOnly: false, // XSS attacks protection
        sameSite: "lax", // CSRF attacks protection
        maxAge: 7 * 24 * 60 * 60, // expire in 7 days
      })
      .status(200)
      .send({
        message: "ok",
        userId: user.id,
      });
  },
);

// PACKS
fastify.get(
  "/packs",
  { preHandler: [authenticate] },
  async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;

    interface Packs {
      id: number;
      name: string;
      created_at: number;
      cards: number;
    }
    const packs = await query<Packs>(
      "SELECT p.id, p.name, p.created_at, COUNT(c.id)::bigint AS cards FROM packs p LEFT JOIN cards c ON c.pack_id = p.id WHERE p.user_id = $1 GROUP BY p.id ORDER BY p.created_at DESC",
      [userId],
    );

    return reply.status(200).send({
      message: "ok",
      result: packs.rowCount && packs.rowCount > 0 ? packs.rows : [],
    });
  },
);
fastify.get(
  "/packs/:id",
  { preHandler: [authenticate] },
  async (
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.sub;
    const packId = request.params.id;

    const pack = await query(
      "SELECT id, name, modalities, numbers, victories FROM packs WHERE id = $1 AND user_id = $2",
      [packId, userId],
    );

    const cards = await query(
      "SELECT id, numbers FROM cards WHERE pack_id = $1 AND user_id = $2",
      [packId, userId],
    );

    return reply.status(200).send({
      message: "ok",
      result: {
        ...pack.rows[0],
        cards: cards.rows,
      },
    });
  },
);
interface NewPackBody {
  name: string;
  qty: number;
}
fastify.post(
  "/packs/new",
  { preHandler: authenticate },
  async (
    request: FastifyRequest<{ Body: NewPackBody }>,
    reply: FastifyReply,
  ) => {
    const user_id = request.user.sub;
    const name = request.body.name;
    let qty = request.body.qty;

    const mods = new Uint8Array(modalities.map((modality) => modality.id));
    const numbers = new Uint8Array();
    const victories = new Uint8Array();
    const time = Math.floor(Date.now() / 1000);

    const createPack = await query(
      "INSERT INTO packs (user_id, name, modalities, numbers, victories, starts_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [user_id, name, mods, numbers, victories, time, time],
    );
    const packId: number = createPack.rows[0].id;

    // GENERATE CARDS
    const cards: Uint8Array[] = [];

    const base: number[] = [];
    for (let d = 1; d <= 75; d++) base.push(d);

    for (let c = 0; c < qty; c++) {
      cards.push(createCardNumbers(base));
    }

    while (cards.length > 0) {
      for (let c = 0; c < cards.length; c++) {
        const insert = await query(
          "INSERT INTO cards (pack_id, user_id, numbers, created_at) VALUES ($1, $2, $3, $4)",
          [packId, user_id, cards[c], time],
        );
        if (insert.rowCount && insert.rowCount > 0) {
          cards.splice(c, 1);
        }
      }
    }

    return reply.status(201).send({
      message: "ok",
      result: {
        packId: packId,
      },
    });
  },
);

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: ["http://localhost:5173"],
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
