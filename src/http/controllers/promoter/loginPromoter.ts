import { PrismaPromoterRepository } from "@/repositores/prisma/prisma-promoter-repository";
import { generateCookie } from "@/services/cookies-service";
import { generateToken } from "@/services/jwt-service";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { LoginPromoterUseCase } from "@/use-cases/login-promoter";
import { FastifyRequest, FastifyReply } from "fastify";
import {z} from "zod"

export async function loginPromoter(request: FastifyRequest, reply: FastifyReply){
    
    const loginPromoterBodySchema = z.object({

        email: z.string().email(),
        password: z.string().min(8),

    })

    const loginPromoterSchema = loginPromoterBodySchema.parse(request.body)

    try {

        const promotersRepository = new PrismaPromoterRepository()
        const loginPromoterUseCase = new LoginPromoterUseCase(promotersRepository)

        const promoter = await loginPromoterUseCase.execute(loginPromoterSchema)

        const token = generateToken(promoter, "access")
    
        generateCookie(reply, token)

        return reply.status(200).send(promoter);
        

    }catch(error) {

        if(error instanceof InvalidCredentialsError) {

            return reply.status(401).send({message: error.message})

        }

        throw error

    }
}