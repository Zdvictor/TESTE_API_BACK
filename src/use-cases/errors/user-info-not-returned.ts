export class UserInfoNotReturnedError extends Error {
    constructor() {
      super("Informações de usuário não retornadas pelo Google.");
    }
  }
  