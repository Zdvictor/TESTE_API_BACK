import { UsersRepository } from "../repositores/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs"; 
interface LoginUserUseCaseRequest {

    email: string
    password: string

}


interface LoginUseCaseResponse {

    name: string;
    social_name?: string | null;
    email: string;
    cellphone: string | null;
    cpf: string | null;
    id_google?: string | null;
    google_login?: boolean | null;    


}


export class LoginUsersUseCase {

    constructor(private usersRepository: UsersRepository) {}

    async execute({email, password}: LoginUserUseCaseRequest): Promise<LoginUseCaseResponse> {      

        const user = await this.usersRepository.findByEmail(email)

        if(!user) throw new InvalidCredentialsError

        const isPasswordCorrect = await compare(password, user.password_hash!)

        if(!isPasswordCorrect) throw new InvalidCredentialsError

        const { password_hash, ...userWithoutPassword } = user
        
        return userWithoutPassword
    }

}