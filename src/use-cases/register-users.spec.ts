import { expect, describe, it } from 'vitest'
import { RegisterUsersUseCase } from './register-users'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositores/in-memory/in-memory-users-repository'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error.ts'
import { CpfAlreadyExistsError } from './errors/cpf-already-exists-error'

describe('Register Users Use Case', () => {
    it('should be able to register user', async () =>{
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUsersUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
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
        const registerUseCase = new RegisterUsersUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            cpf: '12345678911',
            cellphone: '1234567889',
            password: '12345678'
        })

        const isPasswordCorrectlyHashed = await compare('12345678', user.password_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })
    it('should not be able to register with same email twice', async () =>{
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUsersUseCase(usersRepository)

        const email = 'jhondoe@example.com'

        await registerUseCase.execute({
            name: 'Jhon Doe',
            email,
            cpf: '12345678911',
            cellphone: '1234567889',
            password: '12345678'
        })

        expect(() => 
            registerUseCase.execute({
                name: 'Jhon Doe',
                email,
                cpf: '12345678911',
                cellphone: '1234567889',
                password: '12345678'
            })
        ).rejects.toBeInstanceOf(EmailAlreadyExistsError)

    })
    it('should not be able to register with same cpf twice', async () =>{
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUsersUseCase(usersRepository)

        const cpf = '12345678911'

        await registerUseCase.execute({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            cpf,
            cellphone: '1234567889',
            password: '12345678'
        })

        await expect(() => 
            registerUseCase.execute({
                name: 'Jhon Doe',
                email: 'jhondoe2@example.com',
                cpf,
                cellphone: '1234567889',
                password: '12345678'
            })
        ).rejects.toBeInstanceOf(CpfAlreadyExistsError)

    })
})