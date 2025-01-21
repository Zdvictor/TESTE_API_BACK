import { FastifyInstance } from "fastify";
import { recoveryPassword } from "../controllers/recovery/recovery";
import { validateToken } from "../controllers/recovery/validateToken";
import { resetPassword } from "../controllers/recovery/resetPassword";



export async function recoveryRoutes(app: FastifyInstance) {


    app.post("/recovery", recoveryPassword)
    app.post("/validate-token", validateToken)
    app.post("/reset-password", resetPassword)

}