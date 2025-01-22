import generateQrCodeUtils from "@/services/generate-qr-code";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function generateQrCode(request: FastifyRequest, reply: FastifyReply) {
    

    const generateQrCodeBodySchema = z.object({

        ticketId: z.string(),
        referenceId: z.string(),
        eventId: z.string(),


    })

    const {ticketId, referenceId, eventId} = generateQrCodeBodySchema.parse(request.body)

    try {


        const qrData = JSON.stringify({
            ticketId,
            referenceId,
            eventId
        })

        
        const qrCode = await generateQrCodeUtils(qrData);

        reply.send(qrCode);


    }catch(error) {

        reply.log.error(error);
        reply.status(500).send({ message: "Erro ao gerar QR Code." });
    }

}