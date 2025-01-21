import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"

export async function homeRoutes(app: FastifyInstance) {

    app.get("/", (request: FastifyRequest, reply: FastifyReply) => {

        return reply.status(200).send({ message: "Bem vindo a API da DIVULGAME" })
        
    })
}