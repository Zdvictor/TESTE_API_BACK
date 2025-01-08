import { FastifyInstance } from 'fastify'
import { login as loginUser } from '../controllers/auth/login'
import { create as createUser }  from '../controllers/auth/create'
import { redirectToGoogle } from '../controllers/auth/googleRedirect'
import { googleAuthCallback  } from '../controllers/auth/googleCallback'
// import { create as createPromoter }  from './controllers/promoters/create'


//COMING SOON
//import { authGuard } from '../middlewares/auth-guard'

export async function authRoutes(app: FastifyInstance) {
  
  app.post("/auth/login", loginUser);
  app.post('/auth/register', createUser)
  app.get("/auth/google", redirectToGoogle);
  app.get("/auth/google/callback", googleAuthCallback); 
  
  
}
