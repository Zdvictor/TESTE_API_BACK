import { EventsRepository } from "@/repositores/events-repository";
import { EventNotFoundError } from "./errors/event-not-found-error";
import { PromoterRepository } from "@/repositores/promoter-repository";


interface EventUseCaseRequest {
    
    id: string

}

export class FindEventPromoterUseCase {

    constructor(private eventsRepository: EventsRepository) {}

    async execute({id}: EventUseCaseRequest) {

        const event = await this.eventsRepository.findEventByPromoterId(id);
        
        if(event?.length === 0) throw new EventNotFoundError

        return event;

    }

}