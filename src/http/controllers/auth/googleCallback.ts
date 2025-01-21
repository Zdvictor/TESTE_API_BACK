import { FastifyReply, FastifyRequest } from "fastify";
import { OAuth2Client } from "google-auth-library";
import { PrismaUsersRepository } from "@/repositores/prisma/prisma-users-repository";
import { GoogleLoginUseCase } from "../../../use-cases/google-login";
import { UserInfoNotReturnedError } from "../../../use-cases/errors/user-info-not-returned";
import { generateToken } from "../../../services/jwt-service";
import { generateCookie } from "../../../services/cookies-service";


const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


export async function googleAuthCallback(request: FastifyRequest, reply: FastifyReply) {
  const { code } = request.query as { code: string };

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

    const token = generateToken(user, "access")
  
    generateCookie(reply, token)
    
    return reply.redirect("http://localhost:5173/");
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Erro ao autenticar com o Google." });
  }
}
