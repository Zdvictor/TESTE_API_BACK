import { FastifyInstance } from 'fastify'
import { myProfile } from '../controllers/user/profile';
import {logout} from '../controllers/user/logout'



//COMING SOON
//import { authGuard } from '../middlewares/auth-guard'

export async function userRoutes(app: FastifyInstance) {
  
  app.get("/user/profile", myProfile);
  app.get("/user/logout", logout)

}
