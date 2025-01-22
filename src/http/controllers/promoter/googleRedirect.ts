import { FastifyReply, FastifyRequest } from "fastify";
import { OAuth2Client } from "google-auth-library";

const url = process.env.SERVER_URL! 

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${url}/auth/google/promoter/callback`
);

export async function redirectToGooglePromoter(request: FastifyRequest, reply: FastifyReply) {
  console.log("Chamou")
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    prompt: "consent",
  });

  return reply.redirect(authUrl);
}
