import { Prisma, PromoterPF } from "@prisma/client";

export interface PromoterPFRepository{

    findById(id: string ): Promise<PromoterPF | null>
    findByCpf(cpf: string): Promise<PromoterPF | null>
    findByRg(rg: string): Promise<PromoterPF | null>
    create(data: Prisma.PromoterPFCreateInput ): Promise<PromoterPF | null>
    delete(id: string): Promise<PromoterPF | null>
}