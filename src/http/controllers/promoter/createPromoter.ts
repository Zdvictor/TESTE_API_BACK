import { PrismaPromoterRepository } from "@/repositores/prisma/prisma-promoter-repository";
import { generateCookie } from "@/services/cookies-service";
import { generateToken } from "@/services/jwt-service";
import { CreatePromoterUseCase } from "@/use-cases/create-promoter";
import { PromoterAlreadyExistsError } from "@/use-cases/errors/promoter-already-exists-error";
import { FastifyRequest, FastifyReply } from "fastify";
import {z} from 'zod'
export async function createPromoter(request: FastifyRequest, reply: FastifyReply) {


    const baseSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        // bank: z.string().min(1),
        // pix_key: z.string().min(1),
        account_type: z.enum(["PF", "PJ"]),
    });
  

    const promoterPFSchema = baseSchema.extend({
        account_type: z.literal("PF"),
        cpf: z.string().min(11).max(11),
        rg: z.string().min(8),
        name: z.string().min(1),
        residencial_address: z.string().min(1),
        business_address: z.string().min(1),
        cellphone: z.string().min(1),
    });
  

    const promoterPJSchema = baseSchema.extend({
        account_type: z.literal("PJ"),
        cnpj: z.string().min(14),
        corporate_name: z.string().min(1),
        address: z.string().min(1),
        cellphone: z.string().min(1),
    });
  
  const createPromoterSchema = z.discriminatedUnion("account_type", [
    promoterPFSchema,
    promoterPJSchema,
  ]);

  const createPromoterBody = createPromoterSchema.parse(request.body)


  try {

    const promoterRepository = new PrismaPromoterRepository()
    const createPromoterUseCase = new CreatePromoterUseCase(promoterRepository)

    const promoter = await createPromoterUseCase.execute(createPromoterBody)

    const token = generateToken(promoter, "access")
    
    generateCookie(reply, token)

  
    return reply.status(200).send(promoter)

  }catch(error) {

    if(error instanceof PromoterAlreadyExistsError) {

        return reply.status(409).send({message: error.message})

    }

    throw error

  }

    
}