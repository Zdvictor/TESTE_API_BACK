import { Prisma, Event } from "@prisma/client";

export interface EventsRepository{

    findById(eventId: string ): Promise<Event | null>
    findAll(): Promise<Event[]>
    create(data: Prisma.EventCreateInput): Promise<Event | null>
    deleteById(eventId: string): Promise<Event | null>
 
}