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
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";

export const app = fastify({ logger: true }); // Logger habilitado para monitorar requisições

// Validar se variáveis obrigatórias estão presentes
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
if (!process.env.APP_URL) {
  throw new Error("APP_URL is not defined");
}

// Configurações
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const appUrl = process.env.APP_URL || "http://localhost:5173";
const redisTimeout = 10000; // 10 segundos

// Configuração do Socket.IO com CORS
app.register(fastifySocketIO, {
  cors: {
    origin: appUrl, // Permitir apenas origem específica
    credentials: true, // Habilitar envio de credenciais
  },
});

// Plugins de autenticação e CORS
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
  origin: appUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
});

// Configuração do Redis
app.register(fastifyRedis, {
  url: redisUrl,
  connectTimeout: redisTimeout,
}).ready((err) => {
  if (err) {
    app.log.error("Redis connection failed:", err.message);
    process.exit(1); // Interrompa a execução se o Redis falhar
  } else {
    app.log.info("Redis connected successfully");
  }
});

// Servir arquivos estáticos (como uploads)
app.register(fastifyStatic, {
  root: path.resolve(__dirname, "..", "uploads"),
  prefix: "/uploads/",
});

// Plugin para upload de arquivos
app.register(fastifyMultipart);

// Rotas da aplicação
app.register(appRoutes);

// Tratamento de erros
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  }

  // Log de erros em ambiente de desenvolvimento
  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  return reply.status(500).send({ message: "Internal server error." });
});

// Monitoramento de inicialização do servidor
app.listen({ port: 3333, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error("Error starting server:", err.message);
    process.exit(1);
  }
  app.log.info(`Server running at ${address}`);
});
