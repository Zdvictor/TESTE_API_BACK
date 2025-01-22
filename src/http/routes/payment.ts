import { FastifyInstance } from "fastify";
import { createOrder } from "../controllers/payment/createPayment";
import { notificationUrl } from "../controllers/payment/notificationUrl";
import { calculateFee } from "../controllers/payment/calculateFee";
import { cancelPayment } from "../controllers/payment/cancelPayment";
import { findOrderUser } from '../controllers/payment/findOrderUser';


export function paymentRoutes(app: FastifyInstance) {

    app.get("/orders/:id", findOrderUser);
    app.post("/create-payment", createOrder)
    app.post("/cancel-payment", cancelPayment)
    app.post("/notification-url", notificationUrl)
    app.post("/calculate-fee", calculateFee)

}