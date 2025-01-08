import { UsersRepository } from "@/repositores/users-repository";
import { EmailAlreadyExistsError } from "./errors/email-already-exists-error.ts";
import { CpfAlreadyExistsError } from "./errors/cpf-already-exists-error.ts";
import { hash } from "bcryptjs";
import { User } from "@prisma/client";
import { i } from "vite/dist/node/types.d-aGj9QkWt.js";
import { generateToken, verifyToken } from "../services/jwt-service.js";

interface CreateUserUseCaseRequest {
    name: string
    social_name?: string
    email: string
    cellphone: string
    cpf: string
    password?: string,
    id_google?: string,
    google_login?: boolean

}

interface CreateUseCaseResponse {
    name: string;
    social_name?: string | null;
    email: string;
    cellphone: string | null;
    cpf: string | null;
    id_google?: string | null;
    google_login?: boolean | null; 
}

export class CreateUsersUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({name, social_name, email, cellphone,cpf,password} : CreateUserUseCaseRequest): Promise<CreateUseCaseResponse> {
        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if(userWithSameEmail) {
            throw new EmailAlreadyExistsError()
        }

        const userWithSameCpf = await this.usersRepository.findByCpf(cpf)

        if(userWithSameCpf) {
            throw new CpfAlreadyExistsError()
        }

        const password_hash = password ? await hash(password, 6) : null

        const user = await this.usersRepository.create({
            name,
            social_name,
            email,
            cellphone,
            cpf,
            password_hash,
            id_google: null,
            google_login: false
        })

        const { password_hash: _, ...userWithoutPassword } = user
    

        return  userWithoutPassword
            
        
    }
}