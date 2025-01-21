import { User } from '@prisma/client'
import {app} from '../app'
import { TypeTokenInvalidError } from './errors/type-token-invalid-error'
import { InvalidTokenError } from './errors/invalid-token-error'

type TokenType = 'access' | 'reset_password'       


export const generateToken = (payload: any, type: TokenType, expiresIn = type === "access" ? '1d' :  '15m'  ): string => {

    return app.jwt.sign({...payload, type}, {expiresIn}) 

}



export const verifyToken = async (token: string, expectedType: TokenType): Promise<any> => {

    try {

        const decoded = app.jwt.verify<{ user: User; type: TokenType }>(token)


        if(decoded.type !== expectedType) {

            throw new TypeTokenInvalidError();

        }

        return decoded

    }catch(err) {

        throw new InvalidTokenError();

        
    }
    
}