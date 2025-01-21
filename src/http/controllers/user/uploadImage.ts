import { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import fs from "fs/promises";
import { PrismaUsersRepository } from "@/repositores/prisma/prisma-users-repository";
import { generateCookie } from "@/services/cookies-service";
import { generateToken } from "@/services/jwt-service";

export async function uploadUserImage(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    console.log("Iniciando upload de imagem...");

    // Verifica o arquivo enviado
    const data = await request.file();
    if (!data) {
      console.log("Nenhum arquivo enviado.");
      return reply.code(400).send({ error: "Nenhum arquivo enviado." });
    }

    console.log("Arquivo recebido:", data.filename);

    // Verifica o campo "id"
    const id = data.fields?.id?.value;
    if (!id) {
      console.log("ID do usuário não foi enviado.");
      return reply.code(400).send({ error: "ID do usuário é obrigatório." });
    }

    console.log("ID recebido:", id);

    // Define o diretório de uploads
    const uploadDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "uploads",
      "users"
    );

    console.log("Diretório de upload:", uploadDir);

    await fs.mkdir(uploadDir, { recursive: true });

    // Extrai a extensão com base no mimetype
    const mime = data.mimetype; // Exemplo: 'image/png'
    const extension = mime.split("/")[1]; // Pega a extensão, como 'png'

    if (!extension) {
      console.log("Tipo de arquivo não suportado.");
      return reply.code(400).send({ error: "Tipo de arquivo não suportado." });
    }

    // Salva o arquivo com a extensão correta
    const filename = `${Date.now()}-${id}.${extension}`;
    const filePath = path.join(uploadDir, filename);

    console.log("Caminho completo do arquivo:", filePath);

    await fs.writeFile(filePath, await data.toBuffer());
    console.log("Arquivo salvo com sucesso!");

    // Caminho relativo para salvar no banco
    const relativePath = `/uploads/users/${filename}`;

    // Atualiza o banco de dados
    const userRepository = new PrismaUsersRepository();
    const user = await userRepository.uploadImage(id, relativePath);

    console.log("Banco de dados atualizado com o caminho:", relativePath);

    // Gera o token e o cookie
    const token = generateToken(user, "access");
    generateCookie(reply, token);

    console.log(user)

    return reply.status(200).send(user);
  } catch (error) {
    console.error("Erro ao processar o upload:", error);
    return reply
      .code(500)
      .send({ error: "Erro ao processar o upload da imagem." });
  }
}
