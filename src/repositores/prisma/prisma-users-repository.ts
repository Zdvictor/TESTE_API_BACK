import { Prisma } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { prisma } from "@/lib/prisma";


export class PrismaUsersRepository implements UsersRepository {
    async create(data: Prisma.UserCreateInput){
        const user = await prisma.user.create({
            data
        })

        return user
    }

    async findByEmail(email: string){
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        return user
    }

    async findById(userId: string){
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        return user
    }

    async findByCpf(cpf: string){
        const user = await prisma.user.findUnique({
            where: {
                cpf
            }
        })

        return user
    }

    async update(data: Prisma.UserUpdateInput & {id: string}) {

        
        const user = await prisma.user.update({
            where: {
                id: data.id
            },
            data
        })

        return user
    }

    async updatePassword(userId: string, passwordHash: string) {

        const user = await prisma.user.update({
            where: {

                id: userId
            },
            data: {
                password_hash: passwordHash           
            }
        })

        return user
    }

    async delete(userId: string) {

        const user = await prisma.user.update({

            where: {id: userId},
            data: {

                disable: true

            }

        })

        return user

    }
}