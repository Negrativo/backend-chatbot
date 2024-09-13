import { Sequelize } from "sequelize";
import Event from "../model/Event.js";
import { Json } from "sequelize/lib/utils";

class EventController {
	async findConversas(req, res) {
		const adminId = req.adminId;
		try {
			// Consulta no estilo SQL `SELECT distinct sender_id FROM public.events`
			const conversas = await Event.findAll();

			if (conversas && conversas.length > 0) {
				res.send({ conversas });
			} else {
				res.status(404).send({ message: "Nenhuma conversa encontrada." });
			}
		} catch (error) {
			console.error("Error listing events:", error);
			res.status(500).send({ error: "Houve um problema interno, tente novamente mais tarde." });
		}
	}

	async findMensagens(req, res) {
		try {
			// Busca todos os eventos
			const events = await Event.findAll();

			// Array para armazenar as conversas filtradas
			const conversas = [];
			// console.log(events);
			// Itera sobre cada evento e extrai os dados relevantes
			events.forEach((event) => {
				console.log(event.dataValues.data);
				let eventData = event.dataValues.data;

				// Verifica se o campo data está em string e tenta parseá-lo para JSON
				if (typeof eventData === "string") {
					try {
						eventData = JSON.parse(eventData); // Converte string JSON em objeto
					} catch (error) {
						console.error("Erro ao converter data em JSON:", error);
						return; // Pula este evento se não for possível parsear
					}
				}
				// Verifica se o campo "data" existe e é um objeto válido
				if (eventData && eventData.event) {
					// Filtra apenas os eventos de tipo "user" ou "bot"
					if (eventData.event === "user" || eventData.event === "bot") {
						conversas.push({
							sender_id: event.sender_id,
							type: eventData.event,
							text: eventData.text,
							timestamp: event.timestamp,
						});
					}
				}
			});

			// Verifica se a array de conversas tem algum resultado
			if (conversas.length > 0) {
				res.send({ conversas });
			} else {
				res.status(404).send({ message: "Nenhuma conversa encontrada." });
			}
		} catch (error) {
			console.error("Error creating eventbot:", error);
			if (error.name === "SequelizeUniqueConstraintError") {
				return res.status(400).json({ error: "Código do eventbot já cadastrado." });
			}
			res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
		}
	}
}

export default new EventController();
