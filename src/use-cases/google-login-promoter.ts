import { UsersRepository } from "@/repositores/users-repository";
import { OAuth2Client } from "google-auth-library";
import { Promoter, User } from "@prisma/client";
import { InvalidTokenGoogleError } from "./errors/invalid-token-google-error";
import { PromoterRepository } from "@/repositores/promoter-repository";
import { PromoterPFRepository } from "@/repositores/promoter-pf-repository";
import { PromoterPJRepository } from "@/repositores/promoter-pj-repository";

interface GoogleLoginPromoterUseCaseRequest {
  token: string;
}

interface GoogleLoginPromoterUseCaseResponse {
  promoter: {
    
    email: string;
    id_google?: string | null;
    google_login?: boolean | null;    

  };
  isNewUser: boolean;
}

export class GoogleLoginPromoterUseCase {
  constructor(private promoterRepository: PromoterRepository, private googleClient: OAuth2Client) {}

  async execute({ token }: { token: string }): Promise<{ promoter: Promoter; isNewUser: boolean }> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Token inválido do Google.");
    }

    const { email, name, sub } = payload;
    let promoter = await this.promoterRepository.findByEmail(email!);
    const isNewUser = !promoter;

    if (!promoter) {
      promoter = await this.promoterRepository.create({
        email: email!,
        id_google: sub,
        google_login: true,
        password_hash: null,
      });
    }

    return { promoter, isNewUser };
  }
}

