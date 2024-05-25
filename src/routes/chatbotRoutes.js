import { Router } from 'express';
import ChatBotController from '../controllers/ChatBotController.js';
import AuthMiddleware from "../middlewares/auth.js";

const ChatbotRouter = Router();

ChatbotRouter.post('/chat/criarConversa', ChatBotController.create);
ChatbotRouter.get('/chat/buscarConversas', AuthMiddleware, ChatBotController.findAll);

export default ChatbotRouter;