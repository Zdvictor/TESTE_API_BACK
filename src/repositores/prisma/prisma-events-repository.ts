import { Event, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EventsRepository } from "../events-repository";


export class PrismaEventsRepository implements EventsRepository {


    async create(data: Prisma.EventCreateInput): Promise<Event | null> {
        
        const event = await prisma.event.create({
            data
        })

        return event

    }

    async findById(eventId: string): Promise<Event | null> {
        
        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        })

        return event
    }

    async findAll(): Promise<Event[]> {

        const events = await prisma.event.findMany({
            include: {
                promoter: {
                    include: {

                        PromoterPF: true,
                        PromoterPJ: true
                    }
                }
            }
        })

        return events
    }

    async uploadImage(eventId: string, image: string): Promise<Event | null> {
        
        const event = await prisma.event.update({

            where: {
                id: eventId
            },

            data: {
                bannerUrl: image
            },

            include: {

                promoter: {

                    include: {

                        PromoterPF: true,
                        PromoterPJ: true
                    }
                }
            }
        })

        return event
    }


    async findEventByPromoterId(promoterId: string): Promise<Event[]> {
        return prisma.event.findMany({
          where: { promoterId: promoterId },
        });
      }
      

    async deleteById(eventId: string): Promise<Event | null> {

        const event = await prisma.event.delete({

            where: {

                id: eventId

            }

        })

        return event

    }


}