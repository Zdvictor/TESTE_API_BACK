import { FastifyReply, FastifyRequest } from "fastify"
import axios from "axios"
import { z } from "zod"

const token = process.env.PAGSEGURO_TOKEN

export async function cancelPayment(request: FastifyRequest, reply: FastifyReply) {
  console.log("Token aqui:", token)

  // 1) Validação do corpo da requisição.
  //    Caso vá receber também reembolso parcial, inclua o campo 'amount'
  //    e faça a lógica de partial refund no body (ex.: { amount: { value: 3000 } }).
  const cancelPaymentBodySchema = z.object({
    charge_id: z.string(),
  })

  const { charge_id } = cancelPaymentBodySchema.parse(request.body)

  // 2) Montar URL de cancelamento
  const url = `https://sandbox.api.pagseguro.com/charges/${charge_id}/cancel`

  // 3) Se for reembolso total, normalmente o body pode ser vazio.
  //    Se quiser reembolso parcial, substitua por:
  //    const data = { amount: { value: 3000 } } // Ex: reembolso de R$ 30,00
  const data = {
    amount: { value: 400 }
  }

  // 4) Montar headers
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-version": "4.0",
    },
  }

  try {
    // 5) Fazer a requisição POST corretamente:
    //    - 1º parâmetro: URL
    //    - 2º parâmetro: BODY (data)
    //    - 3º parâmetro: Config (headers, etc.)
    const response = await axios.post(url, data, config)

    // 6) Verificar status de sucesso (201 ou 204, segundo docs)
    if (response.status === 201 || response.status === 204) {
      return reply.status(200).send({ message: "Pagamento cancelado com sucesso." })
    } else {
      return reply
        .status(response.status)
        .send({ error: "Falha ao cancelar o pagamento." })
    }
  } catch (error: any) {
    console.error(error)

    // Se for um erro de Axios, pegar a resposta da API do PagSeguro
    if (axios.isAxiosError(error)) {
      return reply
        .status(error.response?.status || 500)
        .send({
          error: error.response?.data || "Erro ao processar a requisição.",
        })
    } else {
      return reply.status(500).send({ error: "Erro interno do servidor." })
    }
  }
}
