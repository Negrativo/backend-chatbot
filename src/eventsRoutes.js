// src/eventRoutes.js
import { Router } from 'express';
import EventController from './controllers/EventController.js';

const EventsRouter = Router();

//TO DO adicionar validação dos campos da req
EventsRouter.post('/evento/cadastrar', EventController.create);
EventsRouter.get('/evento/:codEvento', EventController.findByCodEvento);
EventsRouter.put('/evento/alterar/:codEvento', EventController.update);
EventsRouter.delete('/evento/deletar/:id', EventController.delete);
EventsRouter.get('/eventos/:cpfUser', EventController.listAll);

export default EventsRouter;
