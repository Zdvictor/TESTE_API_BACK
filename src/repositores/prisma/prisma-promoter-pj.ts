import { prisma } from "@/lib/prisma";
import { Prisma, PromoterPJ } from "@prisma/client";
import { PromoterPJRepository } from "../promoter-pj-repository";

export class PrismaPromoterPJRepository implements PromoterPJRepository {

    async findById(id: string): Promise<PromoterPJ | null> {
        
        const promoterPJ = await prisma.promoterPJ.findUnique({
            where: {
                promoter_id: id
            }
        })
        return promoterPJ
    }
    async findByCnpj(cnpj: string): Promise<PromoterPJ | null> {
        
        const promoterPJ = await prisma.promoterPJ.findUnique({
            where: {
                cnpj
            }
        })
        return promoterPJ
    }

    async create(data: Prisma.PromoterPJCreateInput): Promise<PromoterPJ | null> {
        
        const promoterPJ = await prisma.promoterPJ.create({
            data
        })
        return promoterPJ
    }

    async delete(id: string): Promise<PromoterPJ | null> {

        const promoterPJ = await prisma.promoterPJ.delete({
            where: {
                promoter_id: id
            }
        })
        return promoterPJ
    }
}
