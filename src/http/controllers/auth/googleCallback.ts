import { FastifyReply, FastifyRequest } from "fastify";
import { OAuth2Client } from "google-auth-library";
import { PrismaUsersRepository } from "@/repositores/prisma/prisma-users-repository";
import { GoogleLoginUseCase } from "../../../use-cases/google-login";
import { UserInfoNotReturnedError } from "../../../use-cases/errors/user-info-not-returned";
import { generateToken } from "../../../services/jwt-service";
import { generateCookie } from "../../../services/cookies-service";
import { generateCookieWarning } from "@/services/cookies-warninng-service";


const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const url = process.env.APP_URL! 


export async function googleAuthCallback(request: FastifyRequest, reply: FastifyReply) {
  const { code, error } = request.query as { code?: string; error?: string };

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
    const { email, name } = payload;

    if (!email || !name) {
      throw new UserInfoNotReturnedError();
    }

    const usersRepository = new PrismaUsersRepository();
    const googleLoginUseCase = new GoogleLoginUseCase(usersRepository, client);

    const { user, isNewUser } = await googleLoginUseCase.execute({
      token: tokens.id_token!,
    });

    const token = generateToken(user, "access");

    generateCookie(reply, token);
    generateCookieWarning(
      reply,
      isNewUser ? "Cadastro realizado com sucesso!" : "Login realizado com sucesso!"
    );

    return reply.redirect(url);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Erro ao autenticar com o Google." });
  }
}

