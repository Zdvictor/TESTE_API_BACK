import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaPromoterRepository } from "@/repositores/prisma/prisma-promoter-repository";
import { DeletePromoterUseCase } from "@/use-cases/delete-promoter";
import { PromoterNotFoundError } from "@/use-cases/errors/promoter-not-found-error";

export async function deletePromoter(request: FastifyRequest, reply: FastifyReply) {
  const deletePromoterBodySchema = z.object({
    id: z.string(),
  });

  const { id } = deletePromoterBodySchema.parse(request.body);

  try {
    const promoterRepository = new PrismaPromoterRepository();
    const deletePromoterUseCase = new DeletePromoterUseCase(promoterRepository);

    await deletePromoterUseCase.execute({ id });

    return reply.status(200).send({ message: "Promoter deletado com sucesso." });
  } catch (error) {
    if (error instanceof PromoterNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    console.error("Erro ao deletar promoter:", error);
    return reply.status(500).send({ error: "Erro ao deletar promoter." });
  }
}
