import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "../../../repositores/prisma/prisma-users-repository";
import { RecoverPasswordUseCase } from "../../../use-cases/recovery-password";
import { EmailService } from "../../../services/email-service";
import { InvalidCredentialsError } from "../../../use-cases/errors/invalid-credentials-error";


export async function recoveryPassword(request: FastifyRequest, reply: FastifyReply) {
    const recoverBodySchema = z.object({
      email: z.string().email(),
    });
  
    const { email } = recoverBodySchema.parse(request.body);
  
    try {
      const usersRepository = new PrismaUsersRepository();
      const recoverPasswordUseCase = new RecoverPasswordUseCase(usersRepository);
  

      const { token, name } = await recoverPasswordUseCase.execute({ email });
  
      const emailService = new EmailService();
      const recoveryLink = `${process.env.APP_URL}/reset-password?token=${token}`;
      await emailService.sendPasswordRecoveryEmail(email, name, recoveryLink);
  
      return reply.status(200).send({ message: "E-mail de recuperação enviado.", token: token });
    } catch (err) {

        if(err instanceof InvalidCredentialsError){

            return reply.status(400).send({ message: err.message });

        }

        throw err
      
    }
  }
  