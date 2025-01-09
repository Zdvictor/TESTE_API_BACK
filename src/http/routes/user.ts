import { FastifyInstance } from 'fastify'
import { myProfile } from '../controllers/user/profile';
import {logout} from '../controllers/user/logout'
import { update } from '../controllers/user/update';
import {deleteUser} from "../controllers/user/delete"



//COMING SOON
//import { authGuard } from '../middlewares/auth-guard'

export async function userRoutes(app: FastifyInstance) {
  
  app.get("/user/profile", myProfile);
  app.patch("/user", update);
  app.delete("/user", deleteUser) //APENAS DESABILITA POR ENQUANTO ATE ENTENDER MELHORES A REGRAS DE NEGÓCIOS
  app.get("/user/logout", logout);


}
