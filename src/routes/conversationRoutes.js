import { Router } from "express";
import ConversationsController from "../controllers/ConversationsController.js";
import AuthMiddleware from "../middlewares/auth.js";

const ConversationsRouter = Router();

ConversationsRouter.post("/conversas/criar", ConversationsController.saveConversation);
ConversationsRouter.get("/conversa/buscar", AuthMiddleware, ConversationsController.findMessages);

export default ConversationsRouter;
