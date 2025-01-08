import { PrismaUsersRepository } from "@/repositores/prisma/prisma-users-repository";
import { CpfAlreadyExistsError } from "@/use-cases/errors/cpf-already-exists-error";
import { EmailAlreadyExistsError } from "@/use-cases/errors/email-already-exists-error.ts";
import { CreateUsersUseCase } from "@/use-cases/create-users";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { generateToken } from "../../../services/jwt-service";
import { generateCookie } from "../../../services/cookies-service";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createBodySchema = z.object({
        name: z.string(),
        social_name: z.string().optional(),
        email: z.string().email(),
        cellphone: z.string(),
        cpf: z.string().min(11).max(11),
        password: z.string().min(8),

    })

    const createBody = createBodySchema.parse(request.body)
    

    try {
        const usersRepository = new PrismaUsersRepository()
        const createUsersUseCase = new CreateUsersUseCase(usersRepository)

        const user = await createUsersUseCase.execute({
            ...createBody
        })

        const token = generateToken(user, "access")

        generateCookie(reply, token)

        return reply.status(200).send(user)

    } catch(err){
        if(err instanceof EmailAlreadyExistsError || err instanceof CpfAlreadyExistsError){
            return reply.status(409).send({ message : err.message})
        }
        throw err
    }


}