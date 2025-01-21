import { FastifyInstance } from "fastify";
import { chatBot } from "../controllers/chatbot/chat";

export function chatBotRoutes(app: FastifyInstance) {

    app.post("/chatbot", chatBot);

}