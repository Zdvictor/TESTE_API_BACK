import { PromoterRepository } from "@/repositores/promoter-repository";
import { PromoterAlreadyExistsError } from "./errors/promoter-already-exists-error";
import { AccountType, Prisma } from "@prisma/client";
import {hash} from 'bcryptjs'

interface CreatePromoterUseCaseRequestPF {
  email: string;
  password: string;
  account_type: "PF";
  cpf: string;
  rg: string;
  name: string;
  residencial_address: string;
  business_address: string;
  cellphone: string;
}

interface CreatePromoterUseCaseRequestPJ {
  email: string;
  password: string;
  account_type: "PJ";
  cnpj: string;
  corporate_name: string;
  address: string;
  cellphone: string;
}

type CreatePromoterUseCaseRequest = CreatePromoterUseCaseRequestPF | CreatePromoterUseCaseRequestPJ;

export class CreatePromoterUseCase {
  constructor(
    private promoterRepository: PromoterRepository,
  ) {}

  async execute(data: CreatePromoterUseCaseRequest) {
    const password_hash = data.password ? await hash(data.password, 6) : null;
  
    const existingPromoter = await this.promoterRepository.findByEmail(data.email);
    if (existingPromoter) throw new PromoterAlreadyExistsError();
  
    const promoterData: Prisma.PromoterCreateInput & {
      PromoterPF?: Omit<Prisma.PromoterPFCreateInput, "promoter">;
      PromoterPJ?: Omit<Prisma.PromoterPJCreateInput, "promoter">;
    } = {
      email: data.email,
      password_hash,
      account_type: data.account_type,
      google_login: false,
      PromoterPF: data.account_type === AccountType.PF ? {
        cpf: data.cpf,
        rg: data.rg,
        name: data.name,
        residencial_address: data.residencial_address,
        business_address: data.business_address,
        cellphone: data.cellphone,
      } : undefined,
      PromoterPJ: data.account_type === AccountType.PJ ? {
        cnpj: data.cnpj,
        corporate_name: data.corporate_name,
        address: data.address,
        cellphone: data.cellphone,
      } : undefined,
    };
  
    const promoter = await this.promoterRepository.create(promoterData);
  
    const { password_hash: _, ...promoterWithoutPassword } = promoter;
  
    return promoterWithoutPassword;
  }
  
  
}
