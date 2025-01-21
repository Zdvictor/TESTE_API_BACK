import { PrismaEventsRepository } from "@/repositores/prisma/prisma-events-repository";
import { EventsNotFoundError } from "@/use-cases/errors/events-not-found-error";
import { FindAllEventsUseCase } from "@/use-cases/find-all-events";
import { FastifyRequest, FastifyReply } from "fastify";


export async function findAllEvents(request: FastifyRequest, reply: FastifyReply) {

    try {

        const eventRepository = new PrismaEventsRepository();
        const eventFindAllUseCase = new FindAllEventsUseCase(eventRepository);
        
        const event = await eventFindAllUseCase.execute()

        return reply.status(200).send(event)

    }catch(error) {


        if(error instanceof EventsNotFoundError) {

            return reply.status(404).send({message: error.message})

        }

        throw error

    }

}