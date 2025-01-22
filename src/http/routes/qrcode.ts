import { FastifyInstance } from "fastify"
import { generateQrCode } from "../controllers/qrcode/generateQrCode"



export function qrcodeRoutes(app: FastifyInstance) {
    
    app.post("/generate-qr-code", generateQrCode)


}