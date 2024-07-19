import Event from "../model/Event.js"; // Importe o modelo Evento
import moment from 'moment-timezone';

class EventoController {
    async create(req, res) {
        const { cpfUser, nomeUser, codEvento, dataInicial, dataFinal } = req.body;
        console.log(req.body);
        try {
            const dataInicialUTC = moment.tz(dataInicial, 'America/Sao_Paulo').utc().format();
            const dataFinalUTC = moment.tz(dataFinal, 'America/Sao_Paulo').utc().format();

            const newEvento = await Event.create({ cpfUser, nomeUser, codEvento, dataInicial: dataInicialUTC, dataFinal: dataFinalUTC });
            console.log(`Evento created: ${newEvento.id}`);

            const response = {
                ...newEvento.toJSON(),
                dataInicial: moment.tz(newEvento.dataInicial, 'America/Sao_Paulo').format(),
                dataFinal: moment.tz(newEvento.dataFinal, 'America/Sao_Paulo').format()
            };

            res.status(201).json({ message: "Evento cadastrado com sucesso.", evento: response });
        } catch (error) {
            console.error("Error creating evento:", error);
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ error: "Código do evento já cadastrado." });
            }
            res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
        }
    }

    async update(req, res) {
        const { codEvento } = req.params;
        const { dataInicial, dataFinal } = req.body;
        console.log(`Attempting to update evento with codEvento: ${codEvento}`);
        try {
            const dataInicialUTC = moment.tz(dataInicial, 'America/Sao_Paulo').utc().format();
            const dataFinalUTC = moment.tz(dataFinal, 'America/Sao_Paulo').utc().format();

            const [updatedRows, [updatedEvento]] = await Event.update(
                { dataInicial: dataInicialUTC, dataFinal: dataFinalUTC },
                { where: { codEvento }, returning: true } 
            );

            if (updatedRows === 0) {
                console.log(`Evento not found with codEvento: ${codEvento}`);
                return res.status(404).json({ message: "Evento não encontrado." });
            }
            console.log(`Evento updated with codEvento: ${codEvento}`);

            const response = {
                ...updatedEvento.toJSON(),
                dataInicial: moment.tz(updatedEvento.dataInicial, 'America/Sao_Paulo').format(),
                dataFinal: moment.tz(updatedEvento.dataFinal, 'America/Sao_Paulo').format()
            };

            res.json({ message: "Evento atualizado com sucesso.", evento: response });
        } catch (error) {
            console.error("Update error:", error);
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ error: "Código do evento já cadastrado." });
            }
            console.error("Update error:", error);
            res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
        }
    }

    async delete(req, res) {
        const { codEvento } = req.params;
        console.log(`Attempting to delete evento: ${codEvento}`);
        try {
            const deletedRows = await Event.destroy({
                where: { codEvento },
            });
            if (!deletedRows) {
                console.log(`Evento not found: ${codEvento}`);
                return res.status(404).json({ message: "Evento não encontrado." });
            }
            console.log(`Evento deleted: ${codEvento}`);
            res.json({ message: "Evento deletado com sucesso." });
        } catch (error) {
            console.error("Delete error:", error);
            res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
        }
    }

    async findByCodEvento(req, res) {
        const { codEvento } = req.params;
        try {
            const evento = await Event.findOne({
                where: {
                    codEvento: codEvento, 
                },
            });
            if (!evento) {
                return res.status(404).send({ message: "Evento não encontrado." });
            }

            const dataInicialLocal = moment.tz(evento.dataInicial, 'America/Sao_Paulo').format();
            const dataFinalLocal = moment.tz(evento.dataFinal, 'America/Sao_Paulo').format();

            const response = {
                ...evento.toJSON(),
                dataInicial: dataInicialLocal,
                dataFinal: dataFinalLocal
            };

            res.send({ evento: response });
        } catch (error) {
            console.error("Error finding evento by codEvento:", error);
            res.status(500).send({ error: error.message });
        }
    }

    async listAllByCpfUser(req, res) {
        const { cpfUser } = req.params; 
        try {
            const eventos = await Event.findAll({
                where: {
                    cpfUser: cpfUser, 
                },
            });
            if (eventos && eventos.length > 0) {
                const response = eventos.map(evento => ({
                    ...evento.toJSON(),
                    dataInicial: moment.tz(evento.dataInicial, 'America/Sao_Paulo').format(),
                    dataFinal: moment.tz(evento.dataFinal, 'America/Sao_Paulo').format()
                }));

                res.send({ eventos: response });
            } else {
                res.status(404).send({ message: "Nenhum evento encontrado para este usuário." });
            }
        } catch (error) {
            console.error("Error listing eventos:", error);
            res.status(500).send({ error: error.message });
        }
    }

    async listAll(req, res) {
        try {
            const eventos = await Event.findAll();
            if (eventos && eventos.length > 0) {
                const response = eventos.map(evento => ({
                    ...evento.toJSON(),
                    dataInicial: moment.tz(evento.dataInicial, 'America/Sao_Paulo').format(),
                    dataFinal: moment.tz(evento.dataFinal, 'America/Sao_Paulo').format()
                }));

                res.send({ eventos: response });
            } else {
                res.status(404).send({ message: "Nenhum evento encontrado." });
            }
        } catch (error) {
            console.error("Error listing eventos:", error);
            res.status(500).send({ error: error.message });
        }
    }
}

export default new EventoController();
