import { FastifyInstance } from "fastify"; 
import { loginPromoter } from "../controllers/promoter/loginPromoter";
import { createPromoter } from "../controllers/promoter/createPromoter";
import { deletePromoter } from "../controllers/promoter/deletePromoter";




export function promoterRoutes(app: FastifyInstance) {
    

    app.post("/promoter/login", loginPromoter);
    app.post("/promoter/create", createPromoter);
    app.delete("/promoter", deletePromoter);

}