import { PromoterPFRepository } from "@/repositores/promoter-pf-repository";
import { PromoterPJRepository } from "@/repositores/promoter-pj-repository";
import { PromoterRepository } from "@/repositores/promoter-repository";
import { PromoterNotFoundError } from "./errors/promoter-not-found-error";


interface DeletePromoterUseCaseRequest {

    id: string;
    account_type: "PF" | "PJ";

}


export class DeletePromoterUseCase {

    constructor(
        private promoterRepository: PromoterRepository,
        private promoterPFRepository: PromoterPFRepository,
        private PromoterPJRepository: PromoterPJRepository
    ){}


    async execute({id, account_type}: DeletePromoterUseCaseRequest) {

        if(account_type === "PF") {

            const promoter = await this.promoterRepository.findById(id);
            if(!promoter) throw new PromoterNotFoundError
            if(promoter.account_type !== "PF") throw new PromoterNotFoundError

            await this.promoterPFRepository.delete(id);
            await this.promoterRepository.delete(id);

            

        }else if(account_type === "PJ") {

            const promoter = await this.promoterRepository.findById(id);
            if(!promoter) throw new PromoterNotFoundError
            if(promoter.account_type !== "PJ") throw new PromoterNotFoundError

            await this.PromoterPJRepository.delete(id);
            await this.promoterRepository.delete(id);

        }

    }

}