import { Order } from "@prisma/client";

export interface OrderRepository {
  create(data: {
    referenceId: string;
    customerName: string;
    customerEmail: string;
    customerCellPhone: string;
    customerTaxId: string;
    amount: number;
    installments: number;
    chargeId: string;
    status: string;
    paidAt: Date | null;
    userId: string;
    eventId: string;
    paymentMethod: string;
  }): Promise<Order>;

  update(data: {
    reference_id: string;
    status: string;
    paid_at?: string;
  }): Promise<Order>; // Retorna o objeto atualizado
}
