import { FastifyInstance } from 'fastify'
import { myProfile } from '../controllers/user/profile';
import {logout} from '../controllers/user/logout'
import { update } from '../controllers/user/update';
import {deleteUser} from "../controllers/user/delete"
import { uploadUserImage } from '../controllers/user/uploadImage';
import { findOrderUser } from '../controllers/user/findOrderUser';



//COMING SOON
//import { authGuard } from '../middlewares/auth-guard'

export async function userRoutes(app: FastifyInstance) {
  
  app.get("/user/profile", myProfile);
  app.get("/user/orders/:id", findOrderUser);
  app.post("/user/upload-image", uploadUserImage);
  app.patch("/user", update);
  app.delete("/user", deleteUser) //APENAS DESABILITA POR ENQUANTO ATE ENTENDER MELHORES A REGRAS DE NEGÓCIOS
  app.get("/user/logout", logout);


}
