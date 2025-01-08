import { FastifyRequest, FastifyReply } from "fastify";


export async function logout(request: FastifyRequest, reply: FastifyReply) {

    reply.clearCookie('token')

    return reply.status(200).send({ message: "Deslogado com sucesso" });

}