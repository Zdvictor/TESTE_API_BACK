import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaOrderRepository } from "../../../repositores/prisma/prisma-order-repository";

export async function notificationUrl(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
 
    const body = request.body as any;

    // Verificar se existe ao menos 1 charge
    if (!body?.charges || !Array.isArray(body.charges) || body.charges.length === 0) {
      console.error("Notificação sem charges válidas:", body);
      return reply.status(400).send({ error: "Payload inválido: charges ausentes." });
    }

    const charge = body.charges[0];

    const reference_id = charge.reference_id; 
    const status = charge.status; 
    const paid_at = charge.paid_at;

    if (!reference_id || !status) {
      console.error("Dados ausentes na notificação:", charge);
      return reply
        .status(400)
        .send({ error: "Dados insuficientes na notificação (reference_id ou status)." });
    }


    console.log(`Recebido PagSeguro: reference_id=${reference_id}, status=${status}, paid_at=${paid_at}`);


    const paymentType = charge.payment_method?.type ?? "DESCONHECIDO";
    console.log(`Tipo de pagamento: ${paymentType}`);

    // Faça o update do status no seu repositório / banco
    const orderRepository = new PrismaOrderRepository();
    await orderRepository.update({
      reference_id,
      status,
      paid_at,
    });

    (reply.server as any).io.emit("orderUpdated", {
      reference_id,
      status,
      paymentType
    });

    // Retorna sucesso para o PagSeguro
    return reply.status(200).send({ success: true });
  } catch (error) {
    console.error("Erro ao processar notificação:", error);
    return reply.status(500).send({ error: "Erro interno no servidor." });
  }
}
