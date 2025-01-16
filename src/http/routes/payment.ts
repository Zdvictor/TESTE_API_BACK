import { FastifyInstance } from "fastify";
import { createOrder } from "../controllers/payment/createPayment";
import { notificationUrl } from "../controllers/payment/notificationUrl";
import { calculateFee } from "../controllers/payment/calculateFee";



export function paymentRoutes(app: FastifyInstance) {

    app.post("/create-payment", createOrder)
    app.post("/notification-url", notificationUrl)
    app.post("/calculate-fee", calculateFee)

}