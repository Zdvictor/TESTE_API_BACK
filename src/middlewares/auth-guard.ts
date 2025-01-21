import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../services/jwt-service";
import { NotFoundTokenError } from "./errors/not-found-token";


export async function authGuard(request: FastifyRequest, reply: FastifyReply) {
    
    try {

        const token = request.cookies.token;

        if (token) {

            const user = await verifyToken(token, "access"); 

            return reply.status(200).send(user);

        } else {

            throw new NotFoundTokenError();

        }
    } catch (err) {
        reply.status(401).send({
            message: "Somente usuários autenticados podem acessar essa rota.",
        });
    }
}
