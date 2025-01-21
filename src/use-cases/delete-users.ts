import { UsersRepository } from "../repositores/users-repository";
import { UserNotFoundError } from "./errors/user-not-found-error";


interface DeleteUserUseCaseRequest {

    id: string

}

export class DeleteUserUseCase {

    constructor(private usersRepository: UsersRepository) {}


    async execute({ id }: DeleteUserUseCaseRequest) {

        const userExists = await this.usersRepository.findById(id)

        if(!userExists) throw new UserNotFoundError();

        await this.usersRepository.delete(id);

    }

}