

export class EventsNotFoundError extends Error {
    constructor() {
        super("Nenhum evento encontrado");
    }
}