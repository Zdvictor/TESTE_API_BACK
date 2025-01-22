import fastify from "fastify";
import { appRoutes } from "./http/routes/index";
import { ZodError } from "zod";
import { env } from "./env";
import formbody from "@fastify/formbody";

// PLUGINS
import fastifySocketIO from "fastify-socket.io";
import fastifyRedis from "@fastify/redis";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import { JwtNotDefinedError } from "./use-cases/errors/jwt-not-defined-error";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";

export const app = fastify();

app.register(fastifySocketIO, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

if (!process.env.JWT_SECRET) {
  throw new JwtNotDefinedError();
}

app.register(formbody);

app.register(fastifyCookie);

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: "token",
    signed: false,
  },
});

app.register(fastifyCors, {
  origin: true,
  credentials: true,
});

app.register(fastifyRedis, {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
});

// Configuração do fastifyStatic para servir arquivos da pasta "uploads"
app.register(fastifyStatic, {
  root: path.resolve(__dirname, "..", "uploads"), // Caminho absoluto para a pasta "uploads"
  prefix: "/uploads/", // Prefixo da URL
});

app.register(fastifyMultipart);

app.register(appRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  return reply.status(500).send({ message: "Internal server error." });
});
