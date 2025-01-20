

export class MissingFieldError extends Error {
    constructor() {
        super("Você deve informar ao menos um campo para atualização.")
    }
}