import { UsersRepository } from "../repositores/users-repository";
import { hash } from "bcryptjs";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { RedisService } from "../services/redis-service";
import { TokenAlreadyUsedError } from "./errors/token-already-used-error";


interface ResetPasswordUseCaseRequest {
  token: string,

  decoded: {

    id: string;
    type: string;
    exp: number,

  };

  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private redisService: RedisService,
    private usersRepository: UsersRepository 
  ) {}

  async execute({token, decoded, newPassword }: ResetPasswordUseCaseRequest): Promise<void> {

    const isUsed = await this.redisService.isTokenUsed(token);

    if(isUsed) throw new TokenAlreadyUsedError()

    const user = await this.usersRepository.findById(decoded.id);

    if (!user) {
      throw new UserNotFoundError();
    }

    const hashedPassword = await hash(newPassword, 6);

    await this.usersRepository.updatePassword(user.id, hashedPassword);

    const expiration = decoded.exp - Math.floor(Date.now() / 1000);
    await this.redisService.markTokeAsUsed(token, expiration)
  }
}
