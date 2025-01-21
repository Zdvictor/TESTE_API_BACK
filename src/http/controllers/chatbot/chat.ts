import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { openai} from "../../../config/openai";
    
export async function chatBot(request: FastifyRequest, reply: FastifyReply) {
    const messageBodySchema = z.object({
        message: z.string(),
    });

    const { message } = messageBodySchema.parse(request.body);

    try {

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", 
            messages: [
                {
                    role: "system",
                    content: "Você é um assistente virtual que responde apenas em português.",
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            max_tokens: 100, 
            temperature: 0.7,
        });

        const generatedText = response.choices[0]?.message?.content?.trim();

        if (!generatedText || generatedText.length === 0) {
            reply.status(200).send({
                response: "Desculpe, não consegui entender sua pergunta. Pode tentar novamente?",
            });
        } else {
            reply.status(200).send({ response: generatedText });
        }
    } catch (error) {

        if (error instanceof Error) {
            console.error(`Erro ao acessar a API:`, error.message);
        } else {
            console.error(`Erro desconhecido:`, error);
        }
        reply.status(500).send({ error: "Erro ao processar sua mensagem." });
    }
    
}
