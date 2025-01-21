import { Prisma, User } from "@prisma/client";

export interface UsersRepository{
    create(data: Prisma.UserCreateInput): Promise<User>
    findByEmail(email: string): Promise<User | null>
    findById(userId: string ): Promise<User | null> 
    findByCpf(cpf: string): Promise<User| null>
    update(data: Prisma.UserUpdateInput): Promise<User | null>
    updatePassword(userId: string, passwordHash: string): Promise<User | null>
    delete(userId: string): Promise<User | null>
}