import generateQrCodeUtils from "@/services/generate-qr-code";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function generateQrCode(request: FastifyRequest, reply: FastifyReply) {
    

    const generateQrCodeBodySchema = z.object({

        ticketId: z.string(),
        referenceId: z.string(),
        customerName: z.string(),
        customerEmail: z.string().email(),
        eventName: z.string(),


    })

    const {ticketId, referenceId, customerName, customerEmail, eventName} = generateQrCodeBodySchema.parse(request.body)

    try {


        const qrData = JSON.stringify({
            ticketId,
            referenceId,
            customerName,
            customerEmail,
            eventName
        })

        
        const qrCode = await generateQrCodeUtils(qrData);


    }catch(error) {


        console.log(error);
    }

}