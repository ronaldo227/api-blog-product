import { Router } from "express";
import { signin, signup } from '../controllers/auth';
import { authRateLimit } from '../middlewares/security';
import { privateRoute } from '../middlewares/private-route';
import * as authController from '../controllers/auth';

export const authRoutes = Router();


// �🔒 SEGURANÇA: Rate limiting para rotas de auth
authRoutes.use(authRateLimit);

//Routes de autenticação
authRoutes.post('/signup', signup);
authRoutes.post('/signin', signin);
authRoutes.post('/validate', privateRoute, authController.validate);
