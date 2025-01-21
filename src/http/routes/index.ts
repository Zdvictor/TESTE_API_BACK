import { FastifyInstance } from 'fastify'

//ROUTES
import { authRoutes } from './auth'
import { homeRoutes } from './home'
import { userRoutes } from './user'
import { recoveryRoutes } from './recovery'
import { chatBotRoutes } from './chatbot'

//COMING SOON
//import { authGuard } from '../middlewares/auth-guard'

export async function appRoutes(app: FastifyInstance) {

  await app.register(homeRoutes)
  await app.register(authRoutes)
  await app.register(userRoutes)
  await app.register(recoveryRoutes)
  await app.register(chatBotRoutes)
  
  
}
