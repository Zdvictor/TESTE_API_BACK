import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaUsersRepository } from "../../../repositores/prisma/prisma-users-repository";
import { z } from "zod";
import { UserNotFoundError } from "../../../use-cases/errors/user-not-found-error";
import { DeleteUserUseCase } from "../../../use-cases/delete-users";

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const deleteBodySchema = z.object({
    id: z.string(),
  });

  const { id } = deleteBodySchema.parse(request.body);


  try {
    const userRepository = new PrismaUsersRepository();
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);

    await deleteUserUseCase.execute({ id });

    return reply.status(200).send({ message: "Usuário Deletado com sucesso" });

  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
