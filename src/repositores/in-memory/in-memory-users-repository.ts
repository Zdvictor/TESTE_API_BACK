import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository{
    public items: User[] = []

    async findByEmail(email: string) {
        const user = this.items.find(item => item.email === email)
        
        if(!user){
            return null
        }

        return user
    }

    async findByCpf(cpf: string) {
        const user = this.items.find(item => item.cpf === cpf)
        
        if(!user){
            return null
        }

        return user
    }

    async create(data: Prisma.UserCreateInput) {
        const user = { 
            id: 'user-1',
            name: data.name,
            social_name: data.social_name || '',
            email: data.email,
            cellphone: data.cellphone,
            cpf: data.cpf,
            password_hash: data.password_hash,
            created_at: new Date()
        }

        this.items.push(user)

        return user
    }
}