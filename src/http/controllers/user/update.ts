import { FastifyRequest, FastifyReply } from "fastify"
import {z} from "zod"
import { PrismaUsersRepository } from "../../../repositores/prisma/prisma-users-repository"
import { UpdateUserUseCase } from "../../../use-cases/update-users"
import { UserNotFoundError } from "../../../use-cases/errors/user-not-found-error"
import { EmailAlreadyExistsError } from "../../../use-cases/errors/email-already-exists-error.ts"
import { CpfAlreadyExistsError } from "../../../use-cases/errors/cpf-already-exists-error"


export async function update(request: FastifyRequest, reply: FastifyReply) {

    const updateBodySchema = z.object({

        id: z.string(),
        name: z.string().optional(),
        social_name: z.string().optional(),
        email: z.string().email().optional(),
        cellphone: z.string().optional(),
        cpf: z.string().min(11).max(11).optional(),

    
    })
    
    const updateBody = updateBodySchema.parse(request.body)

    try {

        const usersRepository = new PrismaUsersRepository()
        const updateUserUseCase = new UpdateUserUseCase(usersRepository)

        await updateUserUseCase.execute({
            ...updateBody
        })

        return reply.status(200).send({ message: "Usuário atualizado com sucesso" })


    }catch(err) {

        if(err instanceof UserNotFoundError || err instanceof EmailAlreadyExistsError || err instanceof CpfAlreadyExistsError) {

            return reply.status(404).send({ message: err.message })

        }

        throw err


    }

}