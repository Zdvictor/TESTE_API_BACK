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

const url = process.env.APP_URL!

app.register(fastifySocketIO, {
  cors: {
    origin: '*',  // Permite qualquer origem
    credentials: true,  // Permite o envio de credenciais (cookies, autenticação, etc.)
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
  origin: true,  // Permite qualquer origem
  credentials: true,  // Permite cookies
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],  // Cabeçalhos permitidos
  preflightContinue: false,  // Não continuar após o preflight
});



//APENAS DEPLOY
app.register(fastifyRedis, {
  url: process.env.REDIS_URL || "redis://default:MDMxxufVJWJXK1JjDnqblXxrFeVkWsBB9@redis-1234.c15.us-east-1-4.ec2.cloud.redislabs.com:6379",
});


//VOLTAR AQUI EM AMBIENTE DE DESENVOLVIMENTO
// app.register(fastifyRedis, {
//   host: process.env.REDIS_HOST || "127.0.0.1",
//   port: parseInt(process.env.REDIS_PORT || "6379", 10),
// });

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
