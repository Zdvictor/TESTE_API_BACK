import { EventsRepository } from "@/repositores/events-repository";
import { EventNotFoundError } from "./errors/event-not-found-error";


interface EventUseCaseRequest {
    
    id: string

}

export class FindEventUseCase {

    constructor(private eventRepository: EventsRepository) {}

    async execute({id}: EventUseCaseRequest) {

        const event = await this.eventRepository.findById(id);
        
        if(!event) throw new EventNotFoundError;

        return event;

    }

}