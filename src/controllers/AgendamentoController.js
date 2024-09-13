import Agendamento from "../model/Agendamento.js"; // Importe o modelo Consulta
import moment from "moment-timezone";

class AgendamentoController {
	async create(req, res) {
		const { cpfUser, nomeUser, codConsulta, dataInicial, dataFinal } = req.body;
		console.log(req.body);
		try {
			const dataInicialUTC = moment.tz(dataInicial, "America/Sao_Paulo").utc().format();
			const dataFinalUTC = moment.tz(dataFinal, "America/Sao_Paulo").utc().format();

			const newConsulta = await Agendamento.create({
				cpfUser,
				nomeUser,
				codConsulta,
				dataInicial: dataInicialUTC,
				dataFinal: dataFinalUTC,
			});
			console.log(`Consulta created: ${newConsulta.id}`);

			const response = {
				...newConsulta.toJSON(),
				dataInicial: moment.tz(newConsulta.dataInicial, "America/Sao_Paulo").format(),
				dataFinal: moment.tz(newConsulta.dataFinal, "America/Sao_Paulo").format(),
			};

			res.status(201).json({ message: "Consulta cadastrado com sucesso.", consulta: response });
		} catch (error) {
			console.error("Error creating consulta:", error);
			if (error.name === "SequelizeUniqueConstraintError") {
				return res.status(400).json({ error: "Código do consulta já cadastrado." });
			}
			res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
		}
	}

	async update(req, res) {
		const { codConsulta } = req.params;
		const { dataInicial, dataFinal } = req.body;
		console.log(`Attempting to update consulta with codConsulta: ${codConsulta}`);
		try {
			const dataInicialUTC = moment.tz(dataInicial, "America/Sao_Paulo").utc().format();
			const dataFinalUTC = moment.tz(dataFinal, "America/Sao_Paulo").utc().format();

			const [updatedRows, [updatedConsulta]] = await Agendamento.update(
				{ dataInicial: dataInicialUTC, dataFinal: dataFinalUTC },
				{ where: { codConsulta }, returning: true }
			);

			if (updatedRows === 0) {
				console.log(`Consulta not found with codConsulta: ${codConsulta}`);
				return res.status(404).json({ message: "Consulta não encontrado." });
			}
			console.log(`Consulta updated with codConsulta: ${codConsulta}`);

			const response = {
				...updatedConsulta.toJSON(),
				dataInicial: moment.tz(updatedConsulta.dataInicial, "America/Sao_Paulo").format(),
				dataFinal: moment.tz(updatedConsulta.dataFinal, "America/Sao_Paulo").format(),
			};

			res.json({ message: "Consulta atualizado com sucesso.", consulta: response });
		} catch (error) {
			console.error("Update error:", error);
			if (error.name === "SequelizeUniqueConstraintError") {
				return res.status(400).json({ error: "Código do consulta já cadastrado." });
			}
			console.error("Update error:", error);
			res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
		}
	}

	async delete(req, res) {
		const { codConsulta } = req.params;
		console.log(`Attempting to delete consulta: ${codConsulta}`);
		try {
			const deletedRows = await Agendamento.destroy({
				where: { codConsulta },
			});
			if (!deletedRows) {
				console.log(`Consulta not found: ${codConsulta}`);
				return res.status(404).json({ message: "Consulta não encontrado." });
			}
			console.log(`Consulta deleted: ${codConsulta}`);
			res.json({ message: "Consulta deletado com sucesso." });
		} catch (error) {
			console.error("Delete error:", error);
			res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
		}
	}

	async findByCodAgendamento(req, res) {
		const { codConsulta } = req.params;
		try {
			const consulta = await Agendamento.findOne({
				where: {
					codConsulta: codConsulta,
				},
			});
			if (!consulta) {
				return res.status(404).send({ message: "Consulta não encontrado." });
			}

			const dataInicialLocal = moment.tz(consulta.dataInicial, "America/Sao_Paulo").format();
			const dataFinalLocal = moment.tz(consulta.dataFinal, "America/Sao_Paulo").format();

			const response = {
				...consulta.toJSON(),
				dataInicial: dataInicialLocal,
				dataFinal: dataFinalLocal,
			};

			res.send({ consulta: response });
		} catch (error) {
			console.error("Error finding consulta by codConsulta:", error);
			res.status(500).send({ error: error.message });
		}
	}

	async listAllByCpfUser(req, res) {
		const { cpfUser } = req.params;
		try {
			const agendamentos = await Agendamento.findAll({
				where: {
					cpfUser: cpfUser,
				},
			});
			if (agendamentos && agendamentos.length > 0) {
				const response = agendamentos.map((consulta) => ({
					...consulta.toJSON(),
					dataInicial: moment.tz(consulta.dataInicial, "America/Sao_Paulo").format(),
					dataFinal: moment.tz(consulta.dataFinal, "America/Sao_Paulo").format(),
				}));

				res.send({ agendamentos: response });
			} else {
				res.status(404).send({ message: "Nenhum consulta encontrado para este usuário." });
			}
		} catch (error) {
			console.error("Error listing agendamentos:", error);
			res.status(500).send({ error: error.message });
		}
	}

	async listAll(req, res) {
		try {
			const agendamento = await Agendamento.findAll();
			if (agendamento && agendamento.length > 0) {
				const response = agendamento.map((agendamento) => ({
					...agendamento.toJSON(),
					dataInicial: moment.tz(agendamento.dataInicial, "America/Sao_Paulo").format(),
					dataFinal: moment.tz(agendamento.dataFinal, "America/Sao_Paulo").format(),
				}));

				res.send({ agendamentos: response });
			} else {
				res.status(404).send({ message: "Nenhum consulta encontrado." });
			}
		} catch (error) {
			console.error("Error listing agendamentos:", error);
			res.status(500).send({ error: error.message });
		}
	}
}

export default new AgendamentoController();
