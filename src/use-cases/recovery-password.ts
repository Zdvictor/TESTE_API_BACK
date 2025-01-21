import { UsersRepository } from "../repositores/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { generateToken } from "../services/jwt-service";
import { User } from "@prisma/client";

interface RecoverPasswordUseCaseRequest {
  token: string;
  name: string;
}

export class RecoverPasswordUseCase {
    constructor(private usersRepository: UsersRepository) {}
  
    async execute({ email }: { email: string }): Promise<RecoverPasswordUseCaseRequest> {
      const user = await this.usersRepository.findByEmail(email);
      if (!user) throw new InvalidCredentialsError();
  
      const token = generateToken({id: user.id}, "reset_password");
  
      return { token, name: user.name };
    }
  }
  
