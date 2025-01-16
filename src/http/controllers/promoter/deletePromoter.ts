import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaPromoterPFRepository } from "@/repositores/prisma/prisma-promoter-pf";
import { PrismaPromoterPJRepository } from "@/repositores/prisma/prisma-promoter-pj";
import { PrismaPromoterRepository } from "@/repositores/prisma/prisma-promoter-repository";
import { DeletePromoterUseCase } from "@/use-cases/delete-promoter";
import { PromoterNotFoundError } from "@/use-cases/errors/promoter-not-found-error";



export async function deletePromoter(request: FastifyRequest, reply: FastifyReply) {

    const deletePromoterBodySchema = z.object({

        id: z.string(),
        account_type: z.enum(["PF", "PJ"]),
    
    });

    const deletePromoterSchema = deletePromoterBodySchema.parse(request.body);


    try {

        const promoterRepository = new PrismaPromoterRepository();
        const promoterPFRepository = new PrismaPromoterPFRepository();
        const promoterPJRepository = new PrismaPromoterPJRepository();
        const deletePromoterUseCase = new DeletePromoterUseCase(promoterRepository, promoterPFRepository, promoterPJRepository);

        await deletePromoterUseCase.execute(deletePromoterSchema);

        return reply.status(200).send({message: "Promotor deletado com sucesso"})

    }catch(error) {

        if(error instanceof PromoterNotFoundError) {

            return reply.status(404).send({message: error.message})

        }

        throw error

    }

}