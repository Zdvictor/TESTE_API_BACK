import { PrismaEventsRepository } from "@/repositores/prisma/prisma-events-repository";
import { EventNotFoundError } from "@/use-cases/errors/event-not-found-error";
import { FindEventUseCase } from "@/use-cases/find-events";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";


export async function findEvent(request: FastifyRequest, reply: FastifyReply) {

    const findBodySchema = z.object({
        id: z.string(),
    });

    const findSchema = findBodySchema.parse(request.params);

    try {

        const eventRepository = new PrismaEventsRepository();
        const eventFindUseCase = new FindEventUseCase(eventRepository);
        
        const event = await eventFindUseCase.execute({...findSchema})

        return reply.status(200).send(event)

    }catch(error) {


        if(error instanceof EventNotFoundError) {

            return reply.status(404).send({message: error.message})

        }

        throw error

    }

}