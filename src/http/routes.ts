import { FastifyInstance } from 'fastify'
import { create as createUser }  from './controllers/users/create'
import { create as createPromoter }  from './controllers/promoters/create'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', createUser)
  app.post('/promoters', createPromoter)
}
