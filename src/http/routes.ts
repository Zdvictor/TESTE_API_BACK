import { FastifyInstance } from 'fastify'
import { registerUsers } from './controllers/register-users'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUsers)
}
