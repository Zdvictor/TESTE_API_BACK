import { Order } from "@prisma/client"
import { OrderRepository } from "../orders-repository"
import { prisma } from "@/lib/prisma"

interface CreateOrderData {
  referenceId: string
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
}

export class PrismaOrderRepository implements OrderRepository {
  async create(data: CreateOrderData): Promise<Order> {
    const {
      referenceId,
      customerName,
      customerEmail,
      customerCellPhone,
      customerTaxId,
      amount,
      installments,
      chargeId,
      status,
      paidAt,
      paymentMethod,
      userId,
      promoterId,
      eventId,
    } = data

    return prisma.order.create({
      data: {
        referenceId,
        customerName,
        customerEmail,
        customerCellPhone,
        customerTaxId,
        amount,
        installments,
        chargeId,
        status,
        paidAt,
        paymentMethod,

        // Só conecta user se userId não for nulo
        ...(userId
          ? {
              user: {
                connect: { id: userId },
              },
            }
          : {}),

        // Só conecta promoter se promoterId não for nulo
        ...(promoterId
          ? {
              promoter: {
                connect: { id: promoterId },
              },
            }
          : {}),

        // Conexão com o event é obrigatória
        event: { connect: { id: eventId } },
      },
    })
  }

  async findOrderByUserId(id: string): Promise<Order[]> {
    return prisma.order.findMany({
      where: {
        userId: id,
      },
      include: {
        event: true,
      },
    });
  }
  

  async update({
    reference_id,
    status,
    paid_at,
  }: {
    reference_id: string
    status: string
    paid_at?: string
  }): Promise<Order> {
    const order = await prisma.order.update({
      where: {
        referenceId: reference_id,
      },
      data: {
        status,
        paidAt: status === "PAID" ? new Date(paid_at!) : null,
      },
    })

    return order
  }
}
