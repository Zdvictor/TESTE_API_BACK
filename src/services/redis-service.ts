import { Redis } from "ioredis";


export class RedisService {

    constructor(private redis: Redis) {}

    async markTokeAsUsed(token: string, expiration: number): Promise<void> {

        await this.redis.set(token, "used", "EX", expiration)

    }

    async isTokenUsed(token: string): Promise<boolean> {

        const result = await this.redis.get(token)

        return result === "used"


    }

}