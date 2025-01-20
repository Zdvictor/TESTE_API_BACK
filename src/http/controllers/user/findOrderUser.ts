import { PrismaOrderRepository } from "@/repositores/prisma/prisma-order-repository";
import { OrderNotFoundError } from "@/use-cases/errors/order-not-found-error";
import { findOrderUserUseCase } from "@/use-cases/find-orders-user";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";


export async function findOrderUser(request: FastifyRequest, reply: FastifyReply) {

    const findBodySchema = z.object({
        id: z.string(),
    });

    const findSchema = findBodySchema.parse(request.params);

    try {

        const ordersRepository = new PrismaOrderRepository();
        const orderFindUseCase = new findOrderUserUseCase(ordersRepository);
        
        const orders = await orderFindUseCase.execute({...findSchema})

        return reply.status(200).send(orders)

    }catch(error) {


        if(error instanceof OrderNotFoundError) {

            return reply.status(404).send({message: error.message})

        }

        throw error

    }

}