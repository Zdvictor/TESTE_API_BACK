import { expect, describe, it } from 'vitest'
import { CreateUsersUseCase } from './create-users'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositores/in-memory/in-memory-users-repository'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error.ts'
import { CpfAlreadyExistsError } from './errors/cpf-already-exists-error'

describe('Create Users Use Case', () => {
    it('should be able to create user', async () =>{
        const usersRepository = new InMemoryUsersRepository()
        const createUseCase = new CreateUsersUseCase(usersRepository)

        const { user } = await createUseCase.execute({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            cpf: '12345678911',
            cellphone: '1234567889',
            password: '12345678'
        })

        expect(user.id).toEqual(expect.any(String))
    })
    it('should hash user password upon registration', async () =>{
        const usersRepository = new InMemoryUsersRepository()
        const createUseCase = new CreateUsersUseCase(usersRepository)

        const { user } = await createUseCase.execute({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            cpf: '12345678911',
            cellphone: '1234567889',
            password: '12345678'
        })

        const isPasswordCorrectlyHashed = await compare('12345678', user.password_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })
    it('should not be able to create with same email twice', async () =>{
        const usersRepository = new InMemoryUsersRepository()
        const createUseCase = new CreateUsersUseCase(usersRepository)

        const email = 'jhondoe@example.com'

        await createUseCase.execute({
            name: 'Jhon Doe',
            email,
            cpf: '12345678911',
            cellphone: '1234567889',
            password: '12345678'
        })

        expect(() => 
            createUseCase.execute({
                name: 'Jhon Doe',
                email,
                cpf: '12345678911',
                cellphone: '1234567889',
                password: '12345678'
            })
        ).rejects.toBeInstanceOf(EmailAlreadyExistsError)

    })
    it('should not be able to create with same cpf twice', async () =>{
        const usersRepository = new InMemoryUsersRepository()
        const createUseCase = new CreateUsersUseCase(usersRepository)

        const cpf = '12345678911'

        await createUseCase.execute({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            cpf,
            cellphone: '1234567889',
            password: '12345678'
        })

        await expect(() => 
            createUseCase.execute({
                name: 'Jhon Doe',
                email: 'jhondoe2@example.com',
                cpf,
                cellphone: '1234567889',
                password: '12345678'
            })
        ).rejects.toBeInstanceOf(CpfAlreadyExistsError)

    })
})