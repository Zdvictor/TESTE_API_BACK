import { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import fs from "fs/promises";
import { PrismaEventsRepository } from "@/repositores/prisma/prisma-events-repository";

export async function uploadEventImage(
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
      return reply.code(400).send({ error: "ID do evento é obrigatório." });
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
      "events"
    );

    await fs.mkdir(uploadDir, { recursive: true });

    // Define o nome do arquivo e salva no diretório
    const filename = `${Date.now()}-${id}.${extension}`;
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, await data.toBuffer());
    console.log("Arquivo salvo com sucesso!");

    const relativePath = `/uploads/events/${filename}`;

    // Atualiza o banco de dados
    const eventsRepository = new PrismaEventsRepository();
    const event = await eventsRepository.uploadImage(id, relativePath);

    if (!event) {
      return reply
        .status(404)
        .send({ error: "Evento não encontrado para atualizar imagem." });
    }


    return reply.status(200).send(event);
  } catch (error) {
    console.error("Erro ao processar o upload:", error);
    return reply
      .code(500)
      .send({ error: "Erro ao processar o upload da imagem." });
  }
}
