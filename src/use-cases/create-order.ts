import { OrderRepository } from "@/repositores/orders-repository";
import { UsersRepository } from "@/repositores/users-repository";
import { UserNotFoundError } from "./errors/user-not-found-error";

interface CreateOrderUseCaseRequest {
  referenceId: string;
  ticketUniqueId: string;
  customerName: string;
  customerEmail: string;
  customerCellPhone: string;
  customerTaxId: string;
  amount: number;
  paymentMethod: string;
  installments: number;
  chargeId: string;
  status: string;
  paidAt: Date | null;
  userId?: string | null; // ID do usuário
  promoterId?: string | null;
  eventId: string; // ID do evento
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository
  ) {}

  async execute(data: CreateOrderUseCaseRequest): Promise<void> {
    
    await this.orderRepository.create(data);

  }
}
