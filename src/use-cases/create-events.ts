import { EventsRepository } from "@/repositores/events-repository";
import { PromoterRepository } from "@/repositores/promoter-repository";
import { PromoterNotFoundError } from "./errors/promoter-not-found-error";

interface CreateEventUseCaseRequest {
    // Informações principais do evento
    name: string;
    description: string;
    subject?: string;
    category?: "oficinas" | "shows" | "teatro" | "cursos";
    expectedAudience?: number;
  
    // Datas e horários
    dateStart: Date;
    dateEnd: Date;
  
    // Detalhes financeiros
    price: number;
    fee: number;
  
    // Imagem do banner (opcional)
    bannerUrl?: string;
  
    // Detalhes da localização (opcionais)
    locationName?: string;
    zipCode?: string;
    street?: string;
    streetNumber?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  
    // Relacionamentos
    promoterId: string;
}
  
export class CreateEventUseCase {

    constructor(
      private eventRepository: EventsRepository,
      private promoterRepository: PromoterRepository
    ) {}
  
    async execute(data: CreateEventUseCaseRequest) {
 
      const { promoterId, ...eventData } = data;
  
      const promoter = await this.promoterRepository.findById(promoterId);
  
      if (!promoter) throw new PromoterNotFoundError()
        
      const event = await this.eventRepository.create({
        ...eventData,
        promoter: { connect: { id: promoterId } },
      });

      return event
    }
    
  }
  