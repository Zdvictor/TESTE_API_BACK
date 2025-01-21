import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaUsersRepository } from '../../../repositores/prisma/prisma-users-repository';
import { LoginUsersUseCase } from '../../../use-cases/login-users';
import { InvalidCredentialsError } from '../../../use-cases/errors/invalid-credentials-error';
import { generateToken } from '../../../services/jwt-service';
import { generateCookie } from '../../../services/cookies-service';



export async function login(request: FastifyRequest, reply: FastifyReply) {

    const loginBodySchema = z.object({

        email: z.string().email(),
        password: z.string().min(8),

    })

    const loginBody = loginBodySchema.parse(request.body)

    try {

        const usersRepository = new PrismaUsersRepository()
        const loginUsersUseCase = new LoginUsersUseCase(usersRepository)

        const user = await loginUsersUseCase.execute({
            ...loginBody
        })

        const token = generateToken(user, "access")

        generateCookie(reply, token)
        
        return reply.status(200).send(user);
        
    }catch(err) {

        if(err instanceof InvalidCredentialsError) {
            
            return reply.status(409).send({ message: err.message})
            
        }

        throw err

    }

   
}