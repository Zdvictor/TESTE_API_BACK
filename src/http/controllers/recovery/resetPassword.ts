import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "../../../repositores/prisma/prisma-users-repository";
import { ResetPasswordUseCase } from "../../../use-cases/reset-password";
import { verifyToken } from "../../../services/jwt-service";
import { TypeTokenInvalidError } from "../../../services/errors/type-token-invalid-error";
import { InvalidTokenError } from "../../../services/errors/invalid-token-error";
import { UserNotFoundError } from "../../../use-cases/errors/user-not-found-error";
import { RedisService } from "../../../services/redis-service";
import { TokenAlreadyUsedError } from "../../../use-cases/errors/token-already-used-error";

export async function resetPassword(request: FastifyRequest, reply: FastifyReply) {
  const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(8),
  });

  const { token, newPassword } = resetPasswordSchema.parse(request.body);

  try {

    const decoded = await verifyToken(token, "reset_password")

    const redisService = new RedisService(request.server.redis);
    const usersRepository = new PrismaUsersRepository();
    const resetPasswordUseCase = new ResetPasswordUseCase(redisService, usersRepository);

    
    await resetPasswordUseCase.execute({token, decoded, newPassword });

    return reply.status(200).send({ message: "Senha alterada com sucesso" });
  } catch (err) {
    
    if(err instanceof TypeTokenInvalidError || err instanceof InvalidTokenError || err instanceof UserNotFoundError || err instanceof TokenAlreadyUsedError) {

        return reply.status(400).send({ message: err.message });

    }

    throw err

  }
}
