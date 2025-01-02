import { PrismaUsersRepository } from "@/repositores/prisma/prisma-users-repository";
import { CpfAlreadyExistsError } from "@/use-cases/errors/cpf-already-exists-error";
import { EmailAlreadyExistsError } from "@/use-cases/errors/email-already-exists-error.ts";
import { RegisterUsersUseCase } from "@/use-cases/register-users";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function registerUsers(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        social_name: z.string().optional(),
        email: z.string().email(),
        cellphone: z.string(),
        cpf: z.string().min(11).max(11),
        password: z.string().min(8),
    })

    const registerBody = registerBodySchema.parse(request.body)

    try {
        const usersRepository = new PrismaUsersRepository()
        const registerUsersUseCase = new RegisterUsersUseCase(usersRepository)

        await registerUsersUseCase.execute({
            ...registerBody
        })
    } catch(err){
        if(err instanceof EmailAlreadyExistsError || err instanceof CpfAlreadyExistsError){
            return reply.status(409).send({ message : err.message})
        }
        throw err
    }

    return reply.status(201).send()
}