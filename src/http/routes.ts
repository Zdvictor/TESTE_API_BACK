import { FastifyInstance } from 'fastify'
import { create as createUser }  from './controllers/users/create'
import { redirectToGoogle } from './controllers/users/googleRedirect'
import { googleAuthCallback  } from './controllers/users/googleCallback'
// import { create as createPromoter }  from './controllers/promoters/create'

export async function appRoutes(app: FastifyInstance) {
  
  app.get("/auth/google", redirectToGoogle);
  app.get("/auth/google/callback", googleAuthCallback); 
  app.post('/auth/register', createUser)
}
