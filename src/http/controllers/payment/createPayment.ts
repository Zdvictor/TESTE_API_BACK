import { FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { generateExpirationDate } from "../../../services/expiration-qr-code-service";
import { PrismaOrderRepository } from "../../../repositores/prisma/prisma-order-repository";
import { CreateOrderUseCase } from "../../../use-cases/create-order";
import { PrismaUsersRepository } from "@/repositores/prisma/prisma-users-repository";
import { UserNotFoundError } from "@/use-cases/errors/user-not-found-error";
import { PrismaEventsRepository } from "@/repositores/prisma/prisma-events-repository";
import { EventNotFoundError } from "@/use-cases/errors/event-not-found-error";

const token = process.env.PAGSEGURO_TOKEN;
const notificationUrl = process.env.PAGSEGURO_NOTIFICATION_URL;

export async function createOrder(request: FastifyRequest, reply: FastifyReply) {
  // Validação do corpo da requisição
  const createOrderBodySchema = z.object({
    id: z.string(), // ID do usuário autenticado
    name: z.string(),
    email: z.string().email(),
    cellphone: z.string(),
    cpf: z.string().min(11).max(11),
    amount: z.number().positive(),
    event_id: z.string(), // ID do evento
    event_name: z.string(),
    ticket_quantity: z.number().positive(),
    paymentMethod: z.enum(["PIX", "CREDIT_CARD"]), // Tipo de pagamento
    installments: z.number().int().positive().optional(), // Parcelas opcionais
    card: z
      .object({
        number: z.string().length(16), // Número do cartão
        expirationMonth: z.string().length(2), // Mês de validade (MM)
        expirationYear: z.string().length(4), // Ano de validade (AAAA)
        cvv: z.string().length(3), // Código de segurança (CVV)
        holderName: z.string(), // Nome do titular
      })
      .optional(), // Apenas obrigatório para cartão de crédito
  });
  
  const {
    id,
    name,
    email,
    cellphone,
    cpf,
    amount,
    event_id,
    event_name,
    ticket_quantity,
    paymentMethod,
    installments = 1, // Padrão: 1 parcela
    card,
  } = createOrderBodySchema.parse(request.body);

  console.log("Passou aqui")

  // Validações específicas para cada método de pagamento
  if (paymentMethod === "PIX" && installments > 1) {
    return reply.status(400).send({
      error: "Pix não permite parcelamento. Use 1 parcela para pagamento à vista.",
    });
  }

  if (paymentMethod === "CREDIT_CARD" && (!card || installments < 1)) {
    return reply.status(400).send({
      error: "Os dados do cartão e o número de parcelas são obrigatórios para pagamento com cartão de crédito.",
    });
  }

  try {


    const usersRepository = new PrismaUsersRepository();
    const eventsRepository = new PrismaEventsRepository();

    const user = await usersRepository.findById(id);
    if(!user) throw new UserNotFoundError();

    const event = await eventsRepository.findById(event_id);

    if(!event) throw new EventNotFoundError();

    const referenceId = uuidv4();

    
    let orderPayload: any;

    if (paymentMethod === "PIX") {
      // Configura o payload para Pix
      orderPayload = {
        reference_id: referenceId,
        customer: {
          name,
          email,
          tax_id: cpf.replace(/\D/g, ""),
          phones: [
            {
              country: "55",
              area: Number(cellphone.slice(0, 2)),
              number: Number(cellphone.slice(2)),
              type: "MOBILE",
            },
          ],
        },
        items: [
          {
            reference_id: event_id, // Refere-se ao item
            name: event_name,
            quantity: ticket_quantity,
            unit_amount: Math.round(amount * 100), // Em centavos
          },
        ],
        qr_codes: [
          {
            amount: {
              value: Math.round(amount * 100), // Em centavos
            },
            expiration_date: generateExpirationDate(), // Data de expiração
          },
        ],
        notification_urls: [notificationUrl],
      };
    } else if (paymentMethod === "CREDIT_CARD") {
      // Configura o payload para Cartão de Crédito
      orderPayload = {
        reference_id: referenceId,
        customer: {
          name,
          email,
          tax_id: cpf.replace(/\D/g, ""),
          phones: [
            {
              country: "55",
              area: Number(cellphone.slice(0, 2)),
              number: Number(cellphone.slice(2)),
              type: "MOBILE",
            },
          ],
        },
        items: [
          {
            reference_id: event_id, // Refere-se ao item
            name: event_name,
            quantity: ticket_quantity,
            unit_amount: Math.round(amount * 100), // Em centavos
          },
        ],
        charges: [
          {
            reference_id: referenceId, // Referência da cobrança
            description: "Ingressos Plataforma Divulgame",
            amount: {
              value: Math.round(amount * 100), // Valor em centavos
              currency: "BRL", // Moeda
            },
            payment_method: {
              type: "CREDIT_CARD",
              installments, // Número de parcelas
              capture: true, // Captura automática
              card: {
                number: card!.number,
                exp_month: card!.expirationMonth, // Mês de validade
                exp_year: card!.expirationYear, // Ano de validade
                security_code: card!.cvv, // Código de segurança (CVV)
                holder: {
                  name: card!.holderName, // Nome do titular
                },
              },
            },
          },
        ],
        notification_urls: [notificationUrl],
      };
    }

    console.log("Payload enviado ao PagSeguro:", orderPayload);

    // Enviar para o PagSeguro
    const response = await axios.post(
      "https://sandbox.api.pagseguro.com/orders",
      orderPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Repositório e caso de uso

    const orderRepository = new PrismaOrderRepository();
    const createOrderUseCase = new CreateOrderUseCase(orderRepository);

    // Salvar o pedido no banco de dados
    await createOrderUseCase.execute({
      referenceId,
      customerName: name,
      customerEmail: email,
      customerCellPhone: cellphone,
      customerTaxId: cpf,
      amount,
      paymentMethod,
      installments, // Número de parcelas escolhido pelo cliente
      chargeId: response.data.qr_codes?.[0]?.id || response.data.charges?.[0]?.id || "",
      status: "PENDING", // Status inicial
      paidAt: null, // Como o pedido é novo, ainda não foi pago
      userId: id, // ID do usuário autenticado
      eventId: event_id, // ID do evento relacionado
    });


    return reply.send({
      success: true,
      message: "Pedido criado com sucesso.",
      pagseguroData: response.data,
    });
  } catch (error: any) {

    if(error instanceof UserNotFoundError || error instanceof EventNotFoundError) {

      console.log(error)
      return reply.status(404).send({ message: error.message });

    }
    console.error("Erro ao criar pedido:", error.response?.data || error.message);
    return reply
      .status(error.response?.status || 500)
      .send({ error: error.response?.data || "Erro interno no servidor" });
  }
}
