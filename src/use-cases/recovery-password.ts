import { UsersRepository } from "../repositores/users-repository";
import { generateToken } from "../services/jwt-service";
import { InvalidEmailError } from "./errors/invalid-email-error";

interface RecoverPasswordUseCaseRequest {
  token: string;
  name: string;
}

export class RecoverPasswordUseCase {
    constructor(private usersRepository: UsersRepository) {}
  
    async execute({ email }: { email: string }): Promise<RecoverPasswordUseCaseRequest> {
      const user = await this.usersRepository.findByEmail(email);
      if (!user) throw new InvalidEmailError();
  
      const token = generateToken({id: user.id}, "reset_password");
  
      return { token, name: user.name };
    }
  }
  
