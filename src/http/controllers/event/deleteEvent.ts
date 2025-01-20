import { PrismaEventsRepository } from "@/repositores/prisma/prisma-events-repository";
import { DeleteEventUseCase } from "@/use-cases/delete-events";
import { EventNotFoundError } from "@/use-cases/errors/event-not-found-error";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function deleteEvent(request: FastifyRequest, reply: FastifyReply){


    const deleteBodySchema = z.object({
        id: z.string(),
    });

    const deleteSchema = deleteBodySchema.parse(request.params);


    try {


        const eventRepository = new PrismaEventsRepository();
        const eventDeleteUseCase = new DeleteEventUseCase(eventRepository);

        await eventDeleteUseCase.execute({
            ...deleteSchema
        })

        return reply.status(200).send({message: "Evento deletado com sucesso"})


    }catch(error) {

        if(error instanceof EventNotFoundError) {
            return reply.status(404).send({message: error.message})    
        }
        
        throw error

    }

}