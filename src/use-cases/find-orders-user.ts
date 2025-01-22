import { EventsRepository } from "@/repositores/events-repository";
import { EventNotFoundError } from "./errors/event-not-found-error";
import { PromoterRepository } from "@/repositores/promoter-repository";
import { OrderRepository } from "@/repositores/orders-repository";
import { OrderNotFoundError } from "./errors/order-not-found-error";


interface OrderUseCaseRequest {
    
    id: string

}

export class findOrderUserUseCase {

    constructor(private ordersRepository: OrderRepository) {}

    async execute({id}: OrderUseCaseRequest) {

        const orders = await this.ordersRepository.findOrderByUserId(id);

        console.log(orders)

        if(orders?.length === 0) throw new OrderNotFoundError;

        return orders;

    }

}