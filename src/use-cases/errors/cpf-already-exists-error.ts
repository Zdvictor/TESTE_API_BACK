export class CpfAlreadyExistsError extends Error {
    constructor() {
      super("Cpf já cadastrado.")
    }
  }
  