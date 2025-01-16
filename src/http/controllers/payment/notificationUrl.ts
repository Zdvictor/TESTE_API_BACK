import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaOrderRepository } from "../../../repositores/prisma/prisma-order-repository";
import { NotificationData } from "../../../interface/NotificationData";


export async function notificationUrl(request: FastifyRequest<{ Body: NotificationData }>, reply: FastifyReply) {
  try {
    const notification = request.body;

    // Verifica se o objeto `charges` existe e possui dados
    if (!notification.charges || notification.charges.length === 0) {
      console.error("Notificação inválida:", notification);
      return reply.status(400).send({ error: "Dados insuficientes na notificação." });
    }

    // Extraindo informações do primeiro elemento de `charges`
    const charge = notification.charges[0];
    const { reference_id, status, paid_at } = charge;

    // Verifica se os dados necessários estão presentes
    if (!reference_id || !status) {
      console.error("Dados ausentes na notificação:", charge);
      return reply.status(400).send({ error: "Dados insuficientes na notificação." });
    }

    console.log(`-------------------------------------------------------------------------------------------
      Atualizando pedido com reference_id: ${reference_id}, status: ${status}, paid_at: ${paid_at}
      ------------------------------------------------------------------------------------------------------
      `);

    const orderRepository = new PrismaOrderRepository();

    // Atualiza o status no banco de dados
    await orderRepository.update({
      reference_id,
      status,
      paid_at,
    });


    (reply.server as any).io.emit("orderUpdated", { reference_id, status });


    return reply.status(200).send({ success: true });
  } catch (error) {
    console.error("Erro ao processar notificação:", error);
    return reply.status(500).send({ error: "Erro interno no servidor." });
  }
}
