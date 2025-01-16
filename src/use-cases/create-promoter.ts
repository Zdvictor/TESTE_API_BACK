import { PromoterRepository } from "@/repositores/promoter-repository";
import { PromoterAlreadyExistsError } from "./errors/promoter-already-exists-error";
import { AccountType } from "@prisma/client";
import { PromoterPFRepository } from "@/repositores/promoter-pf-repository";
import { PromoterPJRepository } from "@/repositores/promoter-pj-repository";
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
    private promoterPFRepository: PromoterPFRepository,
    private promoterPJRepository: PromoterPJRepository
  ) {}

  async execute(data: CreatePromoterUseCaseRequest) {

    //SEPARA QUAL TIPO DE PROMOTOR FOI SELECIONADO E SALVAR DADOS DO PROMOTOR PF OU PJ NO BANCO DE DADOS //TAMBEM ARRUMAR PARA PODER APAGAR DADOS DO USUARIO NO BANCO DE DADOS FORGEN KEYS QUEBRANDO A APLICACAO
    let objPromoter;
    let objPromoterPF;
    let objPromoterPJ;

    const password_hash = data.password ? await hash(data.password, 6) : null

    objPromoter = {
        email: data.email,
        password_hash,
        account_type: data.account_type,
    }

    const promoter = await this.promoterRepository.findByEmail(data.email);
    if (promoter) throw new PromoterAlreadyExistsError();

    const promoterCreated = await this.promoterRepository.create(objPromoter); //DEIXAR SENHA OPCIONAL CASO LOGIN SEJA COM GOOGLE

    const {id, password_hash: _, ...promoterWithoutPassword} = promoterCreated

    if(data.account_type === AccountType.PF) {

        objPromoterPF = {

            cpf: data.cpf,
            rg: data.rg,
            name: data.name,
            residencial_address: data.residencial_address,
            business_address: data.business_address,
            cellphone: data.cellphone,
            promoter: {
              connect: {
                id: promoterCreated.id
              }
            }
        }

        const cpfExists  = await this.promoterPFRepository.findByCpf(objPromoterPF.cpf)
        const rgExists  = await this.promoterPFRepository.findByRg(objPromoterPF.rg)

        if(cpfExists || rgExists) throw new PromoterAlreadyExistsError

        const promoterPFCreated = await this.promoterPFRepository.create(objPromoterPF)

        objPromoter = {

          ...promoterWithoutPassword,
          ...promoterPFCreated

        }

    }else if(data.account_type === AccountType.PJ) {

        objPromoterPJ = {
            cnpj: data.cnpj,
            corporate_name: data.corporate_name,
            address: data.address,
            cellphone: data.cellphone,
            promoter: {

              connect: {

                id: promoterCreated.id
                
              }

            }
        }

        const cnpjExists = await this.promoterPJRepository.findByCnpj(objPromoterPJ.cnpj)

        if(cnpjExists) throw new PromoterAlreadyExistsError

        const promoterPJCreated = await this.promoterPJRepository.create(objPromoterPJ)

        objPromoter = {

          ...promoterWithoutPassword,
          ...promoterPJCreated

        }

    }

    return objPromoter
    


  }
}
