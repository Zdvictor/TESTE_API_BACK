import { OrderRepository } from "../repositores/orders-repository";


interface UpdateOrderUseCaseRequest {

    reference_id: string;
    status: string;
    paid_at?: string;

}

export class UpdateOrderUseCase {

    constructor(private orderRepository: OrderRepository){}


    async execute({reference_id, status, paid_at}: UpdateOrderUseCaseRequest) {

        await this.orderRepository.update({reference_id, status, paid_at});

    }

}