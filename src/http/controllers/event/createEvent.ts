import { PrismaEventsRepository } from "@/repositores/prisma/prisma-events-repository";
import { PrismaPromoterRepository } from "@/repositores/prisma/prisma-promoter-repository";
import { CreateEventUseCase } from "@/use-cases/create-events";
import { PromoterNotFoundError } from "@/use-cases/errors/promoter-not-found-error";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function createEvent(request: FastifyRequest, reply: FastifyReply) {
  const categoryEnum = z.enum(["workshops", "shows", "theater", "courses"]);

  const createBodySchema = z.object({

    name: z.string().min(1),
    description: z.string().min(1),
    subject: z.string().optional(),
    category: categoryEnum.optional(),
    expectedAudience: z.number().int().positive().optional(),


    dateStart: z.string().refine((val) => !isNaN(Date.parse(val))),
    dateEnd: z.string().refine((val) => !isNaN(Date.parse(val))),


    price: z.number().nonnegative(),
    fee: z.number().nonnegative(),


    bannerUrl: z.string().url().optional(),


    locationName: z.string().min(1).optional(),
    zipCode: z.string().min(1).optional(),
    street: z.string().min(1).optional(),
    streetNumber: z.string().min(1).optional(),
    complement: z.string().optional(),
    neighborhood: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),

    promoterId: z.string().uuid(),
  });
  
  const validatedData = createBodySchema.parse(request.body);


  try {


    const createEventData = {
      ...validatedData,
      dateStart: new Date(validatedData.dateStart),
      dateEnd: new Date(validatedData.dateEnd),
    };

    const eventsRepository = new PrismaEventsRepository();
    const promoterRepository = new PrismaPromoterRepository();
    const createEventUseCase = new CreateEventUseCase(eventsRepository, promoterRepository);

    await createEventUseCase.execute(createEventData);

    reply.status(201).send({ message: "Evento criado com sucesso!" });
  } catch (error) {
    if(error instanceof PromoterNotFoundError) {

      return reply.status(404).send({message: error.message})

    }

    throw error
  }
  
}
