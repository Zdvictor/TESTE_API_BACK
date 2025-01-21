import { PrismaEventsRepository } from "@/repositores/prisma/prisma-events-repository";
import { EventNotFoundError } from "@/use-cases/errors/event-not-found-error";
import { FindEventPromoterUseCase } from "@/use-cases/find-event-promoter";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";


export async function findEventPromoter(request: FastifyRequest, reply: FastifyReply) {

    const findBodySchema = z.object({
        id: z.string(),
    });

    const findSchema = findBodySchema.parse(request.params);

    try {

        const eventsRepository = new PrismaEventsRepository();
        const eventFindUseCase = new FindEventPromoterUseCase(eventsRepository);
        
        const event = await eventFindUseCase.execute({...findSchema})

        return reply.status(200).send(event)

    }catch(error) {


        if(error instanceof EventNotFoundError) {

            return reply.status(404).send({message: error.message})

        }

        throw error

    }

}