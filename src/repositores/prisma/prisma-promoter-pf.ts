
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

    async update(data: Prisma.PromoterPFUpdateInput & { id: string }): Promise<PromoterPF | null> {
        const updateData = {
          ...(data.cpf && { cpf: data.cpf }),
          ...(data.rg && { rg: data.rg }),
          ...(data.name && { name: data.name }),
          ...(data.residencial_address && { residencial_address: data.residencial_address }),
          ...(data.business_address && { business_address: data.business_address }),
          ...(data.cellphone && { cellphone: data.cellphone }),
        };
      
        return prisma.promoterPF.update({
          where: { promoter_id: data.id },
          data: updateData,
        });
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
