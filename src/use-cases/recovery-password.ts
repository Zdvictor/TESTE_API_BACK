import { PromoterRepository } from "@/repositores/promoter-repository";
import { UsersRepository } from "../repositores/users-repository";
import { generateToken } from "../services/jwt-service";
import { InvalidEmailError } from "./errors/invalid-email-error";
import { PromoterPFRepository } from "@/repositores/promoter-pf-repository";
import { PromoterPJRepository } from "@/repositores/promoter-pj-repository";

interface RecoverPasswordUseCaseRequest {
  token: string;
  name: string;
}

export class RecoverPasswordUseCase {
    constructor(
      private usersRepository: UsersRepository,
      private promoterRepository: PromoterRepository,
      private promoterPFRepository: PromoterPFRepository,
      private promoterPJRepository: PromoterPJRepository

    ) {}
  
    async execute({ email }: { email: string }): Promise<RecoverPasswordUseCaseRequest> {
      const user = await this.usersRepository.findByEmail(email);
      const promoter = await this.promoterRepository.findByEmail(email);
      
      if (user) {

        const token = generateToken({id: user.id}, "reset_password");
  
        return { token, name: user.name};

      }else if(promoter) {

        let name;

        if(promoter.account_type === "PF"){
          const promoterPF = await this.promoterPFRepository.findById(promoter.id);
          name = promoterPF?.name
        }

        if(promoter.account_type === "PJ"){
          const promoterPJ = await this.promoterPJRepository.findById(promoter.id);
          name = promoterPJ?.corporate_name
        }

        const token = generateToken({id: promoter.id}, "reset_password");
  
        return { token, name: name!};
        
      }
      
      throw new InvalidEmailError
  
    }
  }
  
