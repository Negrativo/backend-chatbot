import { Router } from "express";
import EventController from "../controllers/EventController.js";
import AuthMiddleware from "../middlewares/auth.js";

const EventRouter = Router();

EventRouter.get("/event/buscarConversas", AuthMiddleware, EventController.findConversas);
EventRouter.get("/event/buscarMensagens", AuthMiddleware, EventController.findMensagens);

export default EventRouter;
