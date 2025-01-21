import { PrismaPromoterRepository } from "@/repositores/prisma/prisma-promoter-repository";
import { generateCookie } from "@/services/cookies-service";
import { generateToken } from "@/services/jwt-service";
import { UpdatePromoterUseCase } from "@/use-cases/update-promoters";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function updatePromoter(request: FastifyRequest,reply: FastifyReply) {

    const updateBodySchema = z
    .object({
      promoter_id: z.string(),  // Atualize para corresponder à propriedade real se necessário
      account_type: z.enum(["PF", "PJ"]).optional(), 
      email: z.string().email().optional(),
      password: z.string().min(8).optional(),
      create_promoter_for_pf_or_pj: z.boolean().optional(),
      bank: z.preprocess(
        val => (typeof val === "string" && val === "" ? undefined : val),
        z.string().min(1).optional()
      ),
      pix_key: z.preprocess(
        val => (typeof val === "string" && val === "" ? undefined : val),
        z.string().min(1).optional()
      ),
      cpf: z.preprocess(
        val => (typeof val === "string" && val === "" ? undefined : val),
        z.string().min(11).max(11).optional()
      ),
      rg: z.preprocess(
        val => (typeof val === "string" && val === "" ? undefined : val),
        z.string().min(8).optional()
      ),
      name: z.preprocess(
        val => (typeof val === "string" && val === "" ? undefined : val),
        z.string().min(1).optional()
      ),
      residencial_address: z.preprocess(
        val => (typeof val === "string" && val === "" ? undefined : val),
        z.string().min(1).optional()
      ),
      business_address: z.preprocess(
        val => (typeof val === "string" && val === "" ? undefined : val),
        z.string().min(1).optional()
      ),
      cellphone: z.preprocess(
        val => (typeof val === "string" && val === "" ? undefined : val),
        z.string().min(1).optional()
      ),
      cnpj: z.preprocess(
        val => (typeof val === "string" && val === "" ? undefined : val),
        z.string().min(14).optional()
      ),
      corporate_name: z.preprocess(
        val => (typeof val === "string" && val === "" ? undefined : val),
        z.string().min(1).optional()
      ),
      address: z.preprocess(
        val => (typeof val === "string" && val === "" ? undefined : val),
        z.string().min(1).optional()
      ),
    })
  
      

  const updateSchema = updateBodySchema.parse(request.body)

  try {

    const promotersRepository = new PrismaPromoterRepository()
    const updatePromoterUseCase = new UpdatePromoterUseCase(promotersRepository)

    const promoter = await updatePromoterUseCase.execute(updateSchema)

    const token = generateToken(promoter, "access")
        
    generateCookie(reply, token)

    return reply.status(200).send(promoter)


  }catch(error) {

    if(error instanceof Error) {

      return reply.status(400).send({message: error.message})

    }

    throw error

  }

}
