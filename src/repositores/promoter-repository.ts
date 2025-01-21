import { Prisma, Promoter } from "@prisma/client";

export interface PromoterRepository{

    findById(id: string ): Promise<Promoter | null>
    findByEmail(email: string): Promise<Promoter | null>
    create(data: Prisma.PromoterCreateInput ): Promise<Promoter>
    delete(id: string): Promise<Promoter | null>
}