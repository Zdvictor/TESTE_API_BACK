import { EventsRepository } from "@/repositores/events-repository";
import { EventNotFoundError } from "./errors/event-not-found-error";


interface DeleteEventUseCaseResponse {

    id: string

}

export class DeleteEventUseCase {

    constructor(private eventsRepository: EventsRepository) {}


    async execute({id}: DeleteEventUseCaseResponse) {

        const event = await this.eventsRepository.findById(id);

        if(!event) throw new EventNotFoundError;

        await this.eventsRepository.deleteById(id)


    }

}