import { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import fs from "fs/promises";
import { PrismaPromoterRepository } from "@/repositores/prisma/prisma-promoter-repository";
import { generateCookie } from "@/services/cookies-service";
import { generateToken } from "@/services/jwt-service";

export async function uploadUPromoterImage(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    console.log("Iniciando upload de imagem...");

    // Verifica o arquivo enviado
    const data = await request.file();
    if (!data) {
      return reply.code(400).send({ error: "Nenhum arquivo enviado." });
    }

    const id = data.fields?.id?.value;
    if (!id) {
      return reply.code(400).send({ error: "ID do usuário é obrigatório." });
    }

    const mime = data.mimetype;
    const extension = mime.split("/")[1]; // Extrai a extensão, como 'png'
    if (!extension) {
      return reply.code(400).send({ error: "Tipo de arquivo não suportado." });
    }

    const uploadDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "uploads",
      "promoters"
    );

    await fs.mkdir(uploadDir, { recursive: true });

    // Define o nome do arquivo e salva no diretório
    const filename = `${Date.now()}-${id}.${extension}`;
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, await data.toBuffer());
    console.log("Arquivo salvo com sucesso!");

    const relativePath = `/uploads/promoters/${filename}`;

    // Atualiza o banco de dados
    const promoterRepository = new PrismaPromoterRepository();
    const promoter = await promoterRepository.uploadImage(id, relativePath);

    if (!promoter) {
      return reply
        .status(404)
        .send({ error: "Promoter não encontrado para atualizar imagem." });
    }

    // Remove dados sensíveis e prepara a resposta
    const { password_hash: _, ...promoterData } = promoter;

    // Gera o token e define o cookie
    const token = generateToken(promoterData, "access");
    generateCookie(reply, token);

    return reply.status(200).send(promoterData);
  } catch (error) {
    console.error("Erro ao processar o upload:", error);
    return reply
      .code(500)
      .send({ error: "Erro ao processar o upload da imagem." });
  }
}
