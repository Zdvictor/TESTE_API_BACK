import { PromoterRepository } from "@/repositores/promoter-repository";
import { PromoterNotFoundError } from "./errors/promoter-not-found-error";

interface DeletePromoterUseCaseRequest {
  id: string;
}

export class DeletePromoterUseCase {
  constructor(private promoterRepository: PromoterRepository) {}

  async execute({ id }: DeletePromoterUseCaseRequest) {
    const promoter = await this.promoterRepository.findById(id);
    if (!promoter) {
      throw new PromoterNotFoundError();
    }

    await this.promoterRepository.delete(id);
  }
}
