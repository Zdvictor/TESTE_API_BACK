import { FastifyInstance } from "fastify"; 
import { loginPromoter } from "../controllers/promoter/loginPromoter";
import { createPromoter } from "../controllers/promoter/createPromoter";
import { deletePromoter } from "../controllers/promoter/deletePromoter";
import { updatePromoter } from "../controllers/promoter/updatePromoter";
import { redirectToGooglePromoter } from "../controllers/promoter/googleRedirect";
import { googleAuthCallbackPromoter } from "../controllers/promoter/googleCallback";
import { uploadUPromoterImage } from "../controllers/promoter/uploadImage";
import { findEventPromoter } from "../controllers/promoter/findEventPromoter";




export function promoterRoutes(app: FastifyInstance) {
    

    app.get("/promoter/events/:id", findEventPromoter);
    app.get("/auth/google/promoter", redirectToGooglePromoter);
    app.get("/auth/google/promoter/callback", googleAuthCallbackPromoter); 
    app.post("/promoter/login", loginPromoter);
    app.post("/promoter/create", createPromoter);
    app.patch("/promoter", updatePromoter);
    app.post("/promoter/upload-image", uploadUPromoterImage);
    app.delete("/promoter", deletePromoter);

}