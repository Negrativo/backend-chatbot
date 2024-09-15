import { Router } from "express";
import EventController from "../controllers/EventController.js";
import AuthMiddleware from "../middlewares/auth.js";

const EventRouter = Router();

//TO DO adicionar validação dos campos da req
EventRouter.post("/evento/cadastrar", EventController.create);
EventRouter.get("/evento/:codEvento", EventController.findByCodEvento);
EventRouter.put("/evento/atualizar/:codEvento", EventController.update);
EventRouter.delete("/evento/deletar/:codEvento", EventController.delete);
EventRouter.get("/eventos/:cpfUser", EventController.listAllByCpfUser);
EventRouter.get("/eventos", EventController.listAll);

EventRouter.get("/event/buscarConversas", AuthMiddleware, EventController.findConversas);
EventRouter.get("/event/buscarMensagens", AuthMiddleware, EventController.findMensagens);

export default EventRouter;
