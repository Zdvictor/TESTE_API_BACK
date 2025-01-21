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

    async update(data: Prisma.PromoterPJUpdateInput & { id: string }): Promise<PromoterPJ | null> {

        const updateData = {
            ...(data.cnpj && { cnpj: data.cnpj }),
            ...(data.corporate_name && { corporate_name: data.corporate_name }),
            ...(data.address && { address: data.address }),
            ...(data.cellphone && { cellphone: data.cellphone }),
          };
        
          
        return prisma.promoterPJ.update({
            where: { promoter_id: data.id },
            data: updateData,
        });
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
