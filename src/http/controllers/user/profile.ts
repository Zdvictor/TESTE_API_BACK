import { FastifyRequest, FastifyReply } from "fastify";
import { NotFoundTokenError } from "../../../middlewares/errors/not-found-token";
import { verifyToken } from "../../../services/jwt-service";


export async function myProfile(request: FastifyRequest, reply: FastifyReply) {

    const token = request.cookies.token

    try {

        if(token) {

            const user  = await verifyToken(token, "access")

            return reply.status(200).send(user);
    
        }else {
    
            throw new NotFoundTokenError()
        }

    }catch(err) {

        reply.status(401).send({
            message: "Não autorizado"
        });

    }



    

}