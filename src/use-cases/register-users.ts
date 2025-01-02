import { UsersRepository } from "@/repositores/users-repository";
import { EmailAlreadyExistsError } from "./errors/email-already-exists-error.ts";
import { CpfAlreadyExistsError } from "./errors/cpf-already-exists-error.js";
import { hash } from "bcryptjs";
import { User } from "@prisma/client";

interface RegisterUseCaseRequest {
    name: string
    social_name?: string
    email: string
    cellphone: string
    cpf: string
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUsersUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({name, social_name, email, cellphone,cpf,password} : RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if(userWithSameEmail) {
            throw new EmailAlreadyExistsError()
        }

        const userWithSameCpf = await this.usersRepository.findByCpf(cpf)

        if(userWithSameCpf) {
            throw new CpfAlreadyExistsError()
        }

        const password_hash = await hash(password, 6)

        const user = await this.usersRepository.create({
            name,
            social_name,
            email,
            cellphone,
            cpf,
            password_hash
        })

        return {
            user
        }
    }
}