import { Order } from "@prisma/client";

export interface OrderRepository {
  create(data: {
    referenceId: string
    ticketUniqueId: string
    customerName: string
    customerEmail: string
    customerCellPhone: string
    customerTaxId: string
    amount: number
    installments: number
    chargeId: string
    status: string
    paidAt: Date | null
    paymentMethod: string
 
    userId?: string | null
    promoterId?: string | null

    eventId: string
  }): Promise<Order>

  findOrderByUserId(id: string): Promise<Order[]>

  update(data: {
    reference_id: string
    status: string
    paid_at?: string
  }): Promise<number>

}