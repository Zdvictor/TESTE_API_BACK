

export class JwtNotDefinedError extends Error{

    constructor() {

        super('JWT_SECRET não está definido. Por favor, configure-o nas variáveis de ambiente.')
        
    }

}