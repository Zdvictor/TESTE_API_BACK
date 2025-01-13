import { FastifyReply } from "fastify"

export function generateCookieWarning(reply: FastifyReply, message: string) {

    return reply.setCookie("notification", message, {
        
        httpOnly: false,
        maxAge: 5,
        path: "/",
        sameSite: "strict",
        
    })
    
}