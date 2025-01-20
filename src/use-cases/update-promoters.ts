import { PromoterRepository } from "@/repositores/promoter-repository";
import { hash } from "bcryptjs";
import { PromoterNotFoundError } from "./errors/promoter-not-found-error";

interface UpdatePromoterUseCaseRequest {
  promoter_id: string;
  email?: string;
  password?: string;
  bank?: string;
  pix_key?: string;
  cpf?: string;
  rg?: string;
  name?: string;
  residencial_address?: string;
  business_address?: string;
  cellphone?: string;
  cnpj?: string;
  corporate_name?: string;
  address?: string;
  account_type?: "PF" | "PJ";
  create_promoter_for_pf_or_pj?: boolean;
}

export class UpdatePromoterUseCase {
  constructor(private promoterRepository: PromoterRepository) {}

  async execute(data: UpdatePromoterUseCaseRequest) {
    const {
      promoter_id,
      password,
      account_type,
      // agora retiramos manualmente
      create_promoter_for_pf_or_pj,

      // Campos específicos de PF
      cpf,
      rg,
      name,
      residencial_address,
      business_address,

      // Campos específicos de PJ
      cnpj,
      corporate_name,
      address,

      // Pode estar em PF ou PJ
      cellphone,

      // Campos top-level do Promoter
      email,
      bank,
      pix_key,

      // Caso venha mais coisa, ignoramos
      ...ignored
    } = data;

    // Verifica se o promoter existe
    const promoterExists = await this.promoterRepository.findById(promoter_id);
    if (!promoterExists) {
      throw new PromoterNotFoundError();
    }

    // Se tiver senha, gera hash
    const password_hash = password ? await hash(password, 6) : undefined;

    // Prepara dados PF/PJ
    const promoterPFData =
      account_type === "PF"
        ? {
            cpf,
            rg,
            name,
            residencial_address,
            business_address,
            cellphone,
          }
        : undefined;

    const promoterPJData =
      account_type === "PJ"
        ? {
            cnpj,
            corporate_name,
            address,
            cellphone,
          }
        : undefined;

    // Monta objeto final para "Promoter" top-level
    const updateData = {
      id: promoter_id,
      password_hash,
      account_type,

      // Campos top-level que REALMENTE existem em Promoter
      email,
      bank,
      pix_key,

      // Relacionamentos
      PromoterPF: promoterPFData,
      PromoterPJ: promoterPJData,
    };

    // Chama o repositório
    const updatedPromoter = await this.promoterRepository.updateWithRelations(updateData);

    // Remove o hash da senha antes de retornar
    const { password_hash: _, ...promoterWithoutPassword } = updatedPromoter;

    return promoterWithoutPassword;
  }
}
