import { Prisma, PromoterPJ } from "@prisma/client";

export interface PromoterPJRepository{

    findById(id: string ): Promise<PromoterPJ | null>
    findByCnpj(cnpj: string): Promise<PromoterPJ | null>
    create(data: Prisma.PromoterPJCreateInput ): Promise<PromoterPJ | null>
    update(data: Prisma.PromoterPJUpdateInput): Promise<PromoterPJ | null>
    delete(id: string): Promise<PromoterPJ | null>
}