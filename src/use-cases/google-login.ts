import { UsersRepository } from "@/repositores/users-repository";
import { OAuth2Client } from "google-auth-library";
import { User } from "@prisma/client";
import { InvalidTokenGoogleError } from "./errors/invalid-token-google-error";

interface GoogleLoginUseCaseRequest {
  token: string;
}

interface GoogleLoginUseCaseResponse {
  user: User;
  isNewUser: boolean;
}

export class GoogleLoginUseCase {
  constructor(private usersRepository: UsersRepository, private googleClient: OAuth2Client) {}

  async execute({ token }: GoogleLoginUseCaseRequest): Promise<GoogleLoginUseCaseResponse> {

    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new InvalidTokenGoogleError();
    }

    const { email, name, sub } = payload;

    let user = await this.usersRepository.findByEmail(email!);
    let isNewUser = false;

    if (!user) {

      isNewUser = true;

      user = await this.usersRepository.create({
        name: name!,
        cellphone: null,
        cpf: null,
        email: email!,
        id_google: sub,
        google_login: true,
        password_hash: "", 
      });
    }

    return { user, isNewUser };
  }
}
