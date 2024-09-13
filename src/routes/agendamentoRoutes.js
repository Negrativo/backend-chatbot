import { Router } from "express";
import EventController from "../controllers/AgendamentoController.js";

const AgendamentosRouter = Router();

//TO DO adicionar validação dos campos da req
AgendamentosRouter.post("/agendamento/cadastrar", EventController.create);
AgendamentosRouter.get("/agendamento/:codAgendamento", EventController.findByCodAgendamento);
AgendamentosRouter.put("/agendamento/atualizar/:codAgendamento", EventController.update);
AgendamentosRouter.delete("/agendamento/deletar/:codAgendamento", EventController.delete);
AgendamentosRouter.get("/agendamentos/:cpfUser", EventController.listAllByCpfUser);
AgendamentosRouter.get("/agendamentos", EventController.listAll);

export default AgendamentosRouter;
