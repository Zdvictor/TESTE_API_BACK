import { Prisma, Promoter } from "@prisma/client";

export interface PromoterRepository {
  findById(id: string): Promise<Promoter | null>;
  findByEmail(email: string): Promise<Promoter | null>;
  create(
    data: Prisma.PromoterCreateInput & {
      PromoterPF?: Omit<Prisma.PromoterPFCreateInput, "promoter">;
      PromoterPJ?: Omit<Prisma.PromoterPJCreateInput, "promoter">;
    }
  ): Promise<Promoter>;
  update(
    data: Prisma.PromoterUpdateInput & { id: string }
  ): Promise<Promoter | null>;
  updateWithRelations(
    data: Prisma.PromoterUpdateInput & {
      id: string;
      PromoterPF?: Omit<Prisma.PromoterPFCreateInput, "promoter">;
      PromoterPJ?: Omit<Prisma.PromoterPJCreateInput, "promoter">;
    }
  ): Promise<Promoter>;
  uploadImage(promoterId: string, image: string): Promise<Promoter | null>;
  delete(id: string): Promise<Promoter | null>;

  

  // Adicionados:
  findWithRelationsById(id: string): Promise<Promoter | null>; // Busca um Promoter com seus relacionamentos
  findAll(): Promise<Promoter[]>; // Busca todos os Promoters
}
