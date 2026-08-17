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
      message: "Unauthorized",
    });
  }
};

// GLOBALS
import { type Modalities, allModalities } from "./allModalities";
import { shuffleArray, getRandomNumber, isObjectEmpty } from "./utils";
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
// MODALITIES
fastify.get(
  "/modalities",
  { preHandler: [authenticate] },
  async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      message: "ok",
      result: allModalities,
    });
  },
);

// USER
fastify.get(
  "/user",
  { preHandler: [authenticate] },
  async (request: FastifyRequest, reply: FastifyReply) => {
    const id = request.user.sub;

    interface User {
      name: string;
      document: string;
      email: string;
      phone: string;
      plan: number;
      starts_at: number;
      due_at: number;
      status: number;
    }
    const result = await query<User>(
      "SELECT name,document,email,phone,plan,starts_at,due_at,status FROM users WHERE id = $1",
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
      "INSERT INTO users (name, document, email, password, phone, plan, starts_at, due_at, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id",
      [
        name,
        document,
        email,
        passwordHash,
        phone,
        0,
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
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // CSRF attacks protection
        maxAge: 7 * 24 * 60 * 60, // expire in 7 days
      })
      .status(200)
      .send({
        message: "ok",
        userId: String(user.id),
      });
  },
);
fastify.post(
  "/logout",
  async (request: FastifyRequest, reply: FastifyReply) => {
    // CREATE JWT TOKEN
    return reply
      .clearCookie("token", {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      .status(200)
      .send({
        message: "ok",
        userId: "",
      });
  },
);

// PACKSauthenticate
fastify.get(
  "/packs",
  { preHandler: [authenticate] },
  async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;

    const packs = await query(
      "SELECT p.id, p.name, p.created_at, COUNT(c.id)::bigint AS cards FROM packs p LEFT JOIN cards c ON c.pack_id = p.id WHERE p.user_id = $1 GROUP BY p.id ORDER BY p.created_at DESC",
      [userId],
    );

    return reply.status(200).send({
      message: "ok",
      result: packs.rowCount && packs.rowCount > 0 ? packs.rows : [],
    });
  },
);
interface NewPackBody {
  name: string;
  qty: number;
}
const plans: Array<string> = ["Gratuito", "Basico", "Completo"];
fastify.post(
  "/packs/new",
  { preHandler: authenticate },
  async (
    request: FastifyRequest<{ Body: NewPackBody }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.sub;
    const name = request.body.name;
    let qty = request.body.qty;

    const mods = [...allModalities];
    const balls = new Uint8Array();
    const time = Math.floor(Date.now() / 1000);

    let limit: number = 50;

    const userDetails = await query(
      "SELECT plan,due_at FROM users WHERE id = $1",
      [userId],
    );
    if (Number(userDetails.rows[0].due_at) > Math.floor(Date.now() / 1000)) {
      if (userDetails.rows[0].plan === 1) {
        // BASIC
        limit = 500;
      } else if (userDetails.rows[0].plan === 2) {
        // FULL
        limit = 10000;
      }
    }

    if (qty > limit) {
      return reply.status(400).send({
        message: `Limite máximo de ${limit} cartelas por maço no plano ${plans[userDetails.rows[0].plan]}.`,
      });
    }

    const createPack = await query(
      "INSERT INTO packs (user_id, name, modalities, balls, goods, winnings, starts_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      [
        userId,
        name,
        JSON.stringify(mods),
        balls,
        JSON.stringify([]),
        JSON.stringify([]),
        time,
        time,
      ],
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
          [packId, userId, cards[c], time],
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
      "SELECT id, name, modalities, balls, goods, winnings FROM packs WHERE id = $1 AND user_id = $2",
      [packId, userId],
    );
    if (pack.rowCount === 0) {
      return reply.status(401).send({
        message: "Maço não encontrado!",
      });
    }

    const cards = await query(
      "SELECT id, numbers FROM cards WHERE pack_id = $1 AND user_id = $2",
      [packId, userId],
    );

    return reply.status(200).send({
      message: "ok",
      result: {
        ...pack.rows[0],
        cards: cards.rows,
        allModalities: allModalities,
      },
    });
  },
);

interface Goods {
  ball: number;
  modality: string;
  card: number;
}
interface PacksPatchBody {
  action: string;
  ball: number;
  balls: number[];
  goods: Goods[];
  winnings: Array<object>;
  modalities: Modalities[];
}
interface CardWinningObject {
  id: number;
  numbers: number[];
  pattern: number[];
}
interface WinningsObject {
  modality: {
    id: number;
    name: string;
  };
  cards: CardWinningObject[];
}
interface Winnings {
  ball: number;
  winnings: WinningsObject[];
}
fastify.patch(
  "/packs/:id",
  { preHandler: [authenticate] },
  async (
    request: FastifyRequest<{ Body: PacksPatchBody; Params: { id: number } }>,
    reply: FastifyReply,
  ) => {
    const { balls, goods, winnings, modalities } = request.body;

    const winningsList: Winnings[] = isObjectEmpty(winnings)
      ? []
      : (winnings as Winnings[]);

    const packId = request.params.id;
    const userId = request.user.sub;

    const fieldsToUpdate = [];
    const values = [];
    let queryIndex = 1;

    if (balls !== undefined) {
      fieldsToUpdate.push(`balls = $${queryIndex++}`);
      values.push(new Uint8Array(balls));
    }
    if (goods !== undefined) {
      fieldsToUpdate.push(`goods = $${queryIndex++}`);
      values.push(JSON.stringify(goods));
    }
    if (winnings !== undefined) {
      fieldsToUpdate.push(`winnings = $${queryIndex++}`);

      const newWinnings = winningsList
        .map((item) => ({
          ...item,
          winnings: item.winnings.filter((winning) => winning.cards.length > 0),
        }))
        .filter((item) => item.winnings.length > 0);

      values.push(JSON.stringify(newWinnings));
    }
    if (modalities !== undefined) {
      fieldsToUpdate.push(`modalities = $${queryIndex++}`);
      values.push(JSON.stringify(modalities));
    }

    if (fieldsToUpdate.length === 0) {
      return reply.status(200).send({
        message: "ok",
      });
    }

    const update = await query(
      `UPDATE packs SET ${fieldsToUpdate.join(", ")} WHERE id = $${queryIndex++} AND user_id = $${queryIndex++}`,
      [...values, packId, userId],
    );

    return reply.status(201).send({
      message: update.rowCount && update.rowCount === 1 ? "ok" : "failed",
    });
  },
);

fastify.post(
  "/pack/:id/addCards",
  { preHandler: [authenticate] },
  async (
    request: FastifyRequest<{ Body: { qty: number }; Params: { id: number } }>,
    reply: FastifyReply,
  ) => {
    const qty = request.body.qty;
    const packId = request.params.id;
    const userId = request.user.sub;

    let limit: number = 50;
    const userDetails = await query(
      "SELECT p.plan, p.due_at, COUNT(c.id)::bigint AS cards FROM users p LEFT JOIN cards c ON c.pack_id = $1 WHERE p.id = $2 GROUP BY p.plan, p.due_at",
      [packId, userId],
    );

    if (Number(userDetails.rows[0].due_at) > Math.floor(Date.now() / 1000)) {
      console.log("Here");
      if (userDetails.rows[0].plan === 1) {
        // BASIC
        limit = 500;
      } else if (userDetails.rows[0].plan === 2) {
        // FULL
        limit = 10000;
      }
    }
    if (Number(userDetails.rows[0].cards) + qty > limit) {
      return reply.status(400).send({
        message: `Limite máximo de ${limit} excedido.`,
      });
    }

    // GENERATE CARDS
    const cards: Uint8Array[] = [];

    const base: number[] = [];
    for (let d = 1; d <= 75; d++) base.push(d);

    for (let c = 0; c < qty; c++) {
      cards.push(createCardNumbers(base));
    }

    const time = Math.floor(Date.now() / 1000);

    while (cards.length > 0) {
      for (let c = 0; c < cards.length; c++) {
        const insert = await query(
          "INSERT INTO cards (pack_id, user_id, numbers, created_at) VALUES ($1, $2, $3, $4)",
          [packId, userId, cards[c], time],
        );
        if (insert.rowCount && insert.rowCount > 0) {
          cards.splice(c, 1);
        }
      }
    }

    return reply.status(201).send({
      message: cards.length !== 0 ? "Falha ao adicionar cartelas." : "ok",
    });
  },
);

// CARDS
fastify.delete(
  "/cards/:id",
  { preHandler: [authenticate] },
  async (
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.sub;
    const id = request.params.id;

    const removeCard = await query(
      "DELETE FROM cards WHERE id = $1 AND user_id = $2",
      [id, userId],
    );
    if (removeCard.rowCount === 1) {
      return reply.status(200).send({
        message: "ok",
      });
    } else {
      return reply.status(404).send({
        message: "Failed",
      });
    }
  },
);

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: [
        "https://bingou.alexsandrogomes.dev",
        "http://localhost:5173",
        "http://192.168.100.15:5173",
        "http://localhost:1171",
      ],
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

    await fastify.listen({
      port: Number(process.env.NODE_PORT),
      host: "0.0.0.0",
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
