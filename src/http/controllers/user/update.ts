import { FastifyRequest, FastifyReply } from "fastify"
import {z} from "zod"
import { PrismaUsersRepository } from "../../../repositores/prisma/prisma-users-repository"
import { UpdateUserUseCase } from "../../../use-cases/update-users"
import { UserNotFoundError } from "../../../use-cases/errors/user-not-found-error"
import { EmailAlreadyExistsError } from "../../../use-cases/errors/email-already-exists-error.ts"
import { CpfAlreadyExistsError } from "../../../use-cases/errors/cpf-already-exists-error"
import { generateToken } from "@/services/jwt-service"
import { generateCookie } from "@/services/cookies-service"
import { MissingFieldError } from "@/use-cases/errors/missing-field-error"


export async function update(request: FastifyRequest, reply: FastifyReply) {

    const updateBodySchema = z.object({

        id: z.string(),
        name: z.string().optional(),
        social_name: z.string().optional(),
        email: z.string().email().optional(),
        cellphone: z.string().optional(),
        cpf: z.string().min(11).max(11).optional(),
        password: z.string().min(8).optional(),

    
    })
    
    const updateBody = updateBodySchema.parse(request.body)

    try {

        if(!updateBody.name && !updateBody.social_name && !updateBody.email && !updateBody.cellphone && !updateBody.cpf && !updateBody.password) {

            throw new MissingFieldError
    
        }
    

        const usersRepository = new PrismaUsersRepository()
        const updateUserUseCase = new UpdateUserUseCase(usersRepository)

        const user = await updateUserUseCase.execute({
            ...updateBody
        })

        const token = generateToken(user, "access")
        
        generateCookie(reply, token)

        return reply.status(200).send(user)


    }catch(err) {

        if(err instanceof UserNotFoundError || err instanceof EmailAlreadyExistsError || err instanceof CpfAlreadyExistsError || err instanceof MissingFieldError) {

            return reply.status(404).send({ message: err.message })

        }

        throw err


    }

}