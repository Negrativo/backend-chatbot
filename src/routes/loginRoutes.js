import { Router } from "express";
import LoginController from "../controllers/LoginController.js";

const LoginRouter = Router();

LoginRouter.post("/login", LoginController.login);
LoginRouter.post("/criarAdmin", LoginController.createAdmin);
LoginRouter.post("/SolicitarTokenSenha", LoginController.requestPasswordReset);
LoginRouter.post("/recuperarSenha", LoginController.resetPassword);

export default LoginRouter;
