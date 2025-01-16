import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import axios from "axios";


const token = process.env.PAGSEGURO_TOKEN;


export async function calculateFee(request: FastifyRequest, reply: FastifyReply) {
  
  const calculateFeeBodySchema = z.object({
    amount: z.number().positive(), // Valor total da transação
    paymentMethod: z.enum(["CREDIT_CARD"]), // Apenas cartão de crédito por enquanto
    maxInstallments: z.number().int().positive().optional(), // Máximo de parcelas (opcional)
    maxInstallmentsNoInterest: z.number().int().positive().optional(), // Máximo de parcelas sem juros (opcional)
    creditCardBin: z.string().length(6), // BIN do cartão (6 primeiros dígitos)
  });

  // Validação dos dados da requisição
  const parsedBody = calculateFeeBodySchema.safeParse(request.body);

  if (!parsedBody.success) {
    return reply.status(400).send({ error: "Dados inválidos", issues: parsedBody.error.issues });
  }

  const { amount, paymentMethod, maxInstallments = 10, maxInstallmentsNoInterest = 4, creditCardBin } = parsedBody.data;

  try {



    const response = await axios.get(
      "https://sandbox.api.pagseguro.com/charges/fees/calculate",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          payment_methods: paymentMethod,
          value: amount * 100, // Valor em centavos
          max_installments: maxInstallments,
          max_installments_no_interest: maxInstallmentsNoInterest,
          credit_card_bin: creditCardBin,
          show_seller_fees: true,
        },
      }
    );

    // Retornar a resposta com as taxas
    return reply.status(200).send(response.data);
  } catch (error: any) {
    console.error("Erro ao consultar taxas:", error.response?.data || error.message);
    return reply
      .status(500)
      .send({ error: "Erro ao consultar as taxas de parcelamento. Tente novamente mais tarde." });
  }
}
