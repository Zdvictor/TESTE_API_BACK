import { FastifyReply, FastifyRequest } from "fastify";
import { OAuth2Client } from "google-auth-library";
import { UserInfoNotReturnedError } from "../../../use-cases/errors/user-info-not-returned";
import { generateToken } from "../../../services/jwt-service";
import { generateCookie } from "../../../services/cookies-service";
import { generateCookieWarning } from "@/services/cookies-warninng-service";
import { PrismaPromoterRepository } from "@/repositores/prisma/prisma-promoter-repository";
import { GoogleLoginPromoterUseCase } from "@/use-cases/google-login-promoter";
import { PrismaPromoterPFRepository } from "@/repositores/prisma/prisma-promoter-pf";
import { PrismaPromoterPJRepository } from "@/repositores/prisma/prisma-promoter-pj";


const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI_PROMOTER
);

const url = process.env.APP_URL! 


export async function googleAuthCallbackPromoter(request: FastifyRequest, reply: FastifyReply) {
  const { code, error } = request.query as { code: string, error?: string };

    // Tratamento do erro ao cancelar o login
  if (error === "access_denied") {
  
      generateCookieWarning(reply, "Cancelado pelo usuário");
      return reply.redirect(url);
      
  }

  if (!code) {
    return reply.status(400).send({ error: "Código de autorização não fornecido pelo Google." });
  }

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const userInfo = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const payload = userInfo.data as { email: string; name: string };

    if (!payload.email || !payload.name) {
      throw new Error("Informações do usuário não retornadas pelo Google.");
    }

    const promoterRepository = new PrismaPromoterRepository();
    const googleLoginPromoterUseCase = new GoogleLoginPromoterUseCase(promoterRepository, client);

    const { promoter, isNewUser } = await googleLoginPromoterUseCase.execute({
      token: tokens.id_token!,
    });

    const token = generateToken(promoter, "access");
    generateCookie(reply, token);
    generateCookieWarning(reply, isNewUser ? 'Por favor finalize seu cadastro!' : 'Login realizado com sucesso!')
    
    return reply.redirect(
      isNewUser
        ? "http://localhost:5173/producer-dashboard"
        : "http://localhost:5173/"
    );
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Erro ao autenticar com o Google." });
  }
}

