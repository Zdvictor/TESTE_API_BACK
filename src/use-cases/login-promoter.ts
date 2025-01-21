import { PromoterRepository } from "@/repositores/promoter-repository";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";


interface LoginPromoterUseCaseRequest {

    email: string;
    password: string
}

export class LoginPromoterUseCase {

    constructor(
        private promoterRepository: PromoterRepository,
    ){} 

    async execute({email, password}: LoginPromoterUseCaseRequest) {

        let objPromoter;

        const promoter = await this.promoterRepository.findByEmail(email);

        if(!promoter) throw new InvalidCredentialsError

        const isPasswordCorrect = await compare(password, promoter.password_hash)

        if(!isPasswordCorrect) throw new InvalidCredentialsError

        const {password_hash, ...promoterWithoutPassword} = promoter

        return promoterWithoutPassword
        

    }


}