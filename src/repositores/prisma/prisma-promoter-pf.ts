
import { prisma } from "@/lib/prisma";
import { Prisma, Promoter, PromoterPF } from "@prisma/client";
import { PromoterPFRepository } from "../promoter-pf-repository";

export class PrismaPromoterPFRepository implements PromoterPFRepository {

    async findById(id: string): Promise<PromoterPF | null> {
        
        const promoterPF = await prisma.promoterPF.findUnique({
            where: {
                promoter_id: id
            }
        })
        return promoterPF
    }
    async findByCpf(cpf: string): Promise<PromoterPF | null> {
        
        const promoterPF = await prisma.promoterPF.findUnique({
            where: {
                cpf
            }
        })
        return promoterPF
    }

    async findByRg(rg: string): Promise<PromoterPF | null> {
        
        const promoterPF = await prisma.promoterPF.findUnique({
            where: {
                rg
            }
        })
        return promoterPF
    }
    async create(data: Prisma.PromoterPFCreateInput): Promise<PromoterPF | null> {
        
        const promoterPF = await prisma.promoterPF.create({
            data
        })
        return promoterPF
    }

    async delete(id: string): Promise<PromoterPF | null> {
        
        const promoterPF = await prisma.promoterPF.delete({
            where: {
                promoter_id: id
            }   
        })

        return promoterPF
    }
}
