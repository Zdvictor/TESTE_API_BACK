import { FastifyRequest, FastifyReply } from "fastify"
import axios from "axios"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { generateExpirationDate } from "../../../services/expiration-qr-code-service"
import { PrismaOrderRepository } from "../../../repositores/prisma/prisma-order-repository"
import { CreateOrderUseCase } from "../../../use-cases/create-order"
import { PrismaUsersRepository } from "@/repositores/prisma/prisma-users-repository"
import { UserNotFoundError } from "@/use-cases/errors/user-not-found-error"
import { PrismaEventsRepository } from "@/repositores/prisma/prisma-events-repository"
import { EventNotFoundError } from "@/use-cases/errors/event-not-found-error"
import { PrismaPromoterRepository } from "@/repositores/prisma/prisma-promoter-repository"
import generateTicket from "@/services/generate-ticket-service"

const token = process.env.PAGSEGURO_TOKEN
const notificationUrl = process.env.PAGSEGURO_NOTIFICATION_URL

export async function createOrder(request: FastifyRequest, reply: FastifyReply) {
  // 1) Validar corpo da requisição
  //    Note que "amount" ainda existe no body, mas iremos ignorar
  //    em favor do cálculo no backend para maior segurança.
  const createOrderBodySchema = z.object({
    id: z.string().optional(),           // ID do usuário
    promoter_id: z.string().optional(),  // ID do promoter

    name: z.string(),
    email: z.string().email(),
    cellphone: z.string(),
    cpf: z.string().min(11).max(11),

    // Mesmo que seja enviado, não vamos usar diretamente
    amount: z.number().positive(),

    event_id: z.string(),   // ID do evento
    event_name: z.string(),
    ticket_quantity: z.number().positive(),
    paymentMethod: z.enum(["PIX", "CREDIT_CARD"]),
    installments: z.number().int().positive().optional(),
    card: z
      .object({
        number: z.string().length(16),
        expirationMonth: z.string().length(2),
        expirationYear: z.string().length(4),
        cvv: z.string().length(3),
        holderName: z.string(),
      })
      .optional(),
  })

  const {
    id,
    promoter_id,
    name,
    email,
    cellphone,
    cpf,
    // amount -> vindo do body, mas não usado para salvar no DB
    event_id,
    event_name,
    ticket_quantity,
    paymentMethod,
    installments = 1,
    card,
  } = createOrderBodySchema.parse(request.body)

  // 2) Validações específicas
  if (paymentMethod === "PIX" && installments > 1) {
    return reply.status(400).send({
      error: "Pix não permite parcelamento. Use 1 parcela para pagamento à vista.",
    })
  }
  if (paymentMethod === "CREDIT_CARD" && (!card || installments < 1)) {
    return reply.status(400).send({
      error: "Os dados do cartão e o número de parcelas são obrigatórios para pagamento com cartão de crédito.",
    })
  }

  try {
    // 3) Buscar user/promoter no banco
    const usersRepository = new PrismaUsersRepository()
    const promotersRepository = new PrismaPromoterRepository()
    const eventsRepository = new PrismaEventsRepository()

    let user = null
    if (id) {
      user = await usersRepository.findById(id)
    }

    let promoter = null
    if (promoter_id) {
      promoter = await promotersRepository.findById(promoter_id)
    }

    if (!user && !promoter) {
      throw new UserNotFoundError()
    }

    // 4) Verificar se o evento existe
    const event = await eventsRepository.findById(event_id)
    if (!event) throw new EventNotFoundError()

    // 5) Calcular o valor correto no back-end
    //    Cada ingresso custa (priceInCents + fee), multiplicado pela quantidade:
    const priceInCents = Math.round(event.price * 100)
    const fee = Math.round(event.fee * 100)
    // CORRIGIDO: Somar preço + taxa para cada ingresso e multiplicar pela quantidade
    const totalValueInCents = (priceInCents + fee) * ticket_quantity

    const finalAmount = totalValueInCents / 100 //DEPOIS COLOCAR ESSE VALOR FINAL

    // 6) Montar request para PagSeguro
    const referenceId = uuidv4()
    let orderPayload: any

    if (paymentMethod === "PIX") {
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
            reference_id: event_id,
            name: event_name,
            quantity: ticket_quantity,
            unit_amount: priceInCents,
          },
        ],
        qr_codes: [
          {
            amount: {
              value: totalValueInCents, // total em centavos
            },
            expiration_date: generateExpirationDate(),
          },
        ],
        notification_urls: [notificationUrl],
      }
    } else if (paymentMethod === "CREDIT_CARD") {
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
            reference_id: event_id,
            name: event_name,
            quantity: ticket_quantity,
            unit_amount: priceInCents,
          },
        ],
        charges: [
          {
            reference_id: referenceId,
            description: "Ingressos Plataforma Divulgame",
            amount: {
              value: totalValueInCents,
              currency: "BRL",
            },
            payment_method: {
              type: "CREDIT_CARD",
              installments,
              capture: true,
              card: {
                number: card!.number,
                exp_month: card!.expirationMonth,
                exp_year: card!.expirationYear,
                security_code: card!.cvv,
                holder: {
                  name: card!.holderName,
                },
              },
            },
          },
        ],
        notification_urls: [notificationUrl],
      }
    }

    // 7) Enviar para PagSeguro
    const response = await axios.post(
      "https://sandbox.api.pagseguro.com/orders",
      orderPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    // 8) Criar o pedido no banco
    const orderRepository = new PrismaOrderRepository()
    const createOrderUseCase = new CreateOrderUseCase(orderRepository)

    for(let i = 0; i < ticket_quantity; i++) {

      await createOrderUseCase.execute({
        referenceId,
        ticketUniqueId: generateTicket(),
        customerName: name,
        customerEmail: email,
        customerCellPhone: cellphone,
        customerTaxId: cpf,
        amount: ticket_quantity > 1 ? finalAmount / ticket_quantity : finalAmount,
        paymentMethod,
        installments,
        chargeId:
          response.data.qr_codes?.[0]?.id ||
          response.data.charges?.[0]?.id ||
          "",
        status: "PENDING",
        paidAt: null,
        userId: user ? user.id : null,
        promoterId: promoter ? promoter.id : null,
        eventId: event_id,
      })

    }


    // 9) Retornar sucesso
    return reply.send({
      success: true,
      message: "Pedido criado com sucesso.",
      pagseguroData: response.data,
    })
  } catch (error: any) {
    if (error instanceof UserNotFoundError || error instanceof EventNotFoundError) {
      console.log(error)
      return reply.status(404).send({ message: error.message })
    }

    console.error("Erro ao criar pedido:", error.response?.data || error.message)
    return reply
      .status(error.response?.status || 500)
      .send({ error: error.response?.data || "Erro interno no servidor" })
  }
}
