import { Order } from "@prisma/client";
import { OrderRepository } from "../orders-repository";
import { prisma } from "@/lib/prisma";

export class PrismaOrderRepository implements OrderRepository {

  async create({
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
    userId,
    eventId,
    paymentMethod, // Adicione aqui
  }: {
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
    paymentMethod: string; // Tipo da coluna paymentMethod
  }): Promise<Order> {
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
        paymentMethod, // Inclua aqui
        user: { connect: { id: userId } },
        event: { connect: { id: eventId } },
      },
    });
  }

  async update({ reference_id, status, paid_at }: { reference_id: string; status: string; paid_at?: string; }): Promise<Order> {

    const order = await prisma.order.update({
      where: {
        referenceId: reference_id,
      },
      data: {
        status,
        paidAt: status === "PAID" ? new Date(paid_at!) : null,
      },
    });

    return order 
  }
}
