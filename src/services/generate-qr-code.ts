// @ts-ignore
import QRCode from "qrcode";


 const generateQrCodeUtils = async(data: string) => {

    try {


        return await QRCode.toDataURL(data, {

            errorCorrectionLevel: "H",
            width: 300
        })

    }catch(error) {

        throw new Error("Erro ao gerar Qr Code " + error.message)

    }

}


export default generateQrCodeUtils
