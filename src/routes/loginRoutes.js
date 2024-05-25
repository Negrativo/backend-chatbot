import { Router } from 'express';
import LoginController from '../controllers/LoginController.js';

const LoginRouter = Router();

LoginRouter.post('/login', LoginController.login);
LoginRouter.post('/criarAdmin', LoginController.createAdmin);

export default LoginRouter;