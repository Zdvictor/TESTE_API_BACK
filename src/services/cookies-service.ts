import { FastifyReply } from "fastify";

export function generateCookie(reply: FastifyReply, token: string) {

    return reply.setCookie("token", token, {

        httpOnly: true,
        secure: true, // Produção: true (HTTPS)
        sameSite: "none",
        path: "/",
        maxAge: 86400,

      }); 

}
