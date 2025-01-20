import { OrderRepository } from "@/repositores/orders-repository";


interface CancelPaymentUseCaseRequest {
    
    id: string

}
export class CancelPaymentUseCase {

    constructor(private orderRepository: OrderRepository) {}
    async execute({id}: CancelPaymentUseCaseRequest) {

        await this.orderRepository.update({reference_id: id, status: "CANCELED"});

    }
}