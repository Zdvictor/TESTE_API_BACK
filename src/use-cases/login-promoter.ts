import { PromoterRepository } from "@/repositores/promoter-repository";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { PromoterPFRepository } from "@/repositores/promoter-pf-repository";
import { PromoterPJRepository } from "@/repositores/promoter-pj-repository";


interface LoginPromoterUseCaseRequest {

    email: string;
    password: string
}

export class LoginPromoterUseCase {

    constructor(
        private promoterRepository: PromoterRepository,
        private promoterPFRepository: PromoterPFRepository,
        private promoterPJRepository: PromoterPJRepository
    ){} 

    async execute({email, password}: LoginPromoterUseCaseRequest) {

        let objPromoter;

        const promoter = await this.promoterRepository.findByEmail(email);

        if(!promoter) throw new InvalidCredentialsError

        const isPasswordCorrect = await compare(password, promoter.password_hash)

        if(!isPasswordCorrect) throw new InvalidCredentialsError

        const {id, password_hash, ...promoterWithoutPassword} = promoter

        if(promoter.account_type === "PF") {

            const promomterPF = await this.promoterPFRepository.findById(promoter.id);

            objPromoter = {

                ...promoterWithoutPassword,
                ...promomterPF
            }

        }else if(promoter.account_type === "PJ") {

            const promomterPJ = await this.promoterPJRepository.findById(promoter.id);
            objPromoter = {

                ...promoterWithoutPassword,
                ...promomterPJ

            }

        }


        return objPromoter
        

    }


}