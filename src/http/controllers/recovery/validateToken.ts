import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { verifyToken } from "../../../services/jwt-service";
import { TypeTokenInvalidError } from "../../../services/errors/type-token-invalid-error";
import { InvalidTokenError } from "../../../services/errors/invalid-token-error";
import { RedisService } from "../../../services/redis-service";
import { TokenAlreadyUsedError } from "../../../use-cases/errors/token-already-used-error";

export async function validateToken(request: FastifyRequest, reply: FastifyReply) {
  const validateTokenSchema = z.object({
    token: z.string(),
  });

  const { token } = validateTokenSchema.parse(request.body);

  try {

    const redisService = new RedisService(request.server.redis);
  
    const isUsed = await redisService.isTokenUsed(token);

    if(isUsed) throw new TokenAlreadyUsedError()


    await verifyToken(token, "reset_password")

    return reply.status(200).send({ valid: true });

  } catch (err) {

    if(err instanceof TypeTokenInvalidError || err instanceof InvalidTokenError || err instanceof TokenAlreadyUsedError) {

        return reply.status(400).send({ message: err.message });

    }

    throw err

  }
}
