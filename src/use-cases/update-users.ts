import { hash } from "bcryptjs";
import { UsersRepository } from "../repositores/users-repository";
import { CpfAlreadyExistsError } from "./errors/cpf-already-exists-error";
import { EmailAlreadyExistsError } from "./errors/email-already-exists-error.ts";
import { UserNotFoundError } from "./errors/user-not-found-error";

interface UpdateUserUseCaseRequest {
    id: string;
    name?: string;
    social_name?: string;
    email?: string;
    cellphone?: string;
    cpf?: string;
    password?: string;
    password_hash?: string
}

export class UpdateUserUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ id, ...data }: UpdateUserUseCaseRequest) {

        const userExists = await this.usersRepository.findById(id);
        if (!userExists) {
            throw new UserNotFoundError();
        }

     
        if (data.email) {
            const userWithSameEmail = await this.usersRepository.findByEmail(data.email);
            if (userWithSameEmail && userWithSameEmail.id !== id) {
                throw new EmailAlreadyExistsError();
            }
        }

        if (data.cpf) {
            const userWithSameCpf = await this.usersRepository.findByCpf(data.cpf);
            if (userWithSameCpf && userWithSameCpf.id !== id) {
                throw new CpfAlreadyExistsError();
            }
        }

        if(data.password) {
        
            const password_hash = await hash(data.password, 6)
            data.password_hash = password_hash
            delete data.password
        }
        console.log(data)

        return await this.usersRepository.update({ id, ...data });
    }
}
