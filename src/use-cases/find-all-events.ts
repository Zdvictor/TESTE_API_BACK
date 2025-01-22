import { EventsRepository } from "@/repositores/events-repository";
import { EventsNotFoundError } from "./errors/events-not-found-error";


export class FindAllEventsUseCase {

    constructor(private eventsRepository: EventsRepository) {}


    async execute() {

        const events = await this.eventsRepository.findAll();

        if(events.length === 0) throw new EventsNotFoundError;

        return events


    }


}