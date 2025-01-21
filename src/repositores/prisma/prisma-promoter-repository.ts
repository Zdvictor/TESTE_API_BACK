import { prisma } from "@/lib/prisma";
import { Prisma, Promoter } from "@prisma/client";
import { PromoterRepository } from "../promoter-repository";

export class PrismaPromoterRepository implements PromoterRepository {
  async findById(id: string): Promise<Promoter | null> {
    return prisma.promoter.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Promoter | null> {
    return prisma.promoter.findUnique({
      where: { email },
      include: {
        PromoterPF: true,
        PromoterPJ: true,
      },
    });
  }

  async create(
    data: Prisma.PromoterCreateInput & {
      PromoterPF?: Omit<Prisma.PromoterPFCreateInput, "promoter">;
      PromoterPJ?: Omit<Prisma.PromoterPJCreateInput, "promoter">;
    }
  ): Promise<Promoter> {
    const { PromoterPF, PromoterPJ, ...promoterData } = data;

    return prisma.promoter.create({
      data: {
        ...promoterData,
        PromoterPF: PromoterPF
          ? { create: PromoterPF }
          : undefined,
        PromoterPJ: PromoterPJ
          ? { create: PromoterPJ }
          : undefined,
      },
      include: {
        PromoterPF: true,
        PromoterPJ: true,
      },
    });
  }

  async update(
    data: Prisma.PromoterUpdateInput & { id: string }
  ): Promise<Promoter | null> {
    const { id, ...updateData } = data;

    return prisma.promoter.update({
      where: { id },
      data: updateData,
    });
  }

  async updateWithRelations(
    data: Prisma.PromoterUpdateInput & {
      id: string;
      PromoterPF?: Omit<Prisma.PromoterPFCreateInput, "promoter">;
      PromoterPJ?: Omit<Prisma.PromoterPJCreateInput, "promoter">;
    }
  ): Promise<Promoter> {
    const { id, PromoterPF, PromoterPJ, ...updateData } = data;

    return prisma.promoter.update({
      where: { id },
      data: {
        ...updateData,
        PromoterPF: PromoterPF
          ? {
              upsert: {
                create: PromoterPF,
                update: PromoterPF,
              },
            }
          : undefined,
        PromoterPJ: PromoterPJ
          ? {
              upsert: {
                create: PromoterPJ,
                update: PromoterPJ,
              },
            }
          : undefined,
      },
      include: {
        PromoterPF: true,
        PromoterPJ: true,
      },
    });
  }

  async uploadImage(promoterId: string, image: string): Promise<Promoter | null> {
    return prisma.promoter.update({
      where: { id: promoterId },
      data: { profile_image: image },
      include: {
        PromoterPF: true,
        PromoterPJ: true,
      }
    });
  }

  async delete(id: string): Promise<Promoter | null> {
    return prisma.promoter.delete({
      where: { id },
    });
  }

  async findWithRelationsById(id: string): Promise<Promoter | null> {
    return prisma.promoter.findUnique({
      where: { id },
      include: {
        PromoterPF: true,
        PromoterPJ: true,
      },
    });
  }

  async findAll(): Promise<Promoter[]> {
    return prisma.promoter.findMany({
      include: {
        PromoterPF: true,
        PromoterPJ: true,
      },
    });
  }
}
