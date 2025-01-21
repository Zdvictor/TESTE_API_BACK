
import { prisma } from "@/lib/prisma";
import { PromoterRepository } from "../promoter-repository";
import { Prisma, Promoter } from "@prisma/client";

export class PrismaPromoterRepository implements PromoterRepository {

    async findById(id: string): Promise<Promoter | null> {
        
        const promoter = await prisma.promoter.findUnique({
            where: {
                id
            }
        })

        return promoter
    }
    async findByEmail(email: string): Promise<Promoter | null> {
        
        const promoter = await prisma.promoter.findUnique({
            where: {
                email
            }
        })

        return promoter
    }
    async create(data: Prisma.PromoterCreateInput): Promise<Promoter> {
        
        const promoter = await prisma.promoter.create({
            data
        })

        return promoter
    }

    async delete(id: string): Promise<Promoter | null> {
        
        const promoter = await prisma.promoter.delete({
            where: {
                id
            }
        })                                                                                                                                                                                                                                                                                                               

        return promoter

    }

}
