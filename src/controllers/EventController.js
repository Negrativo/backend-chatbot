import Evento from '../model/Evento.js'; // Importe o modelo Evento

class EventoController {
    async create(req, res) {
        const { cpfUser, data, codEvento } = req.body;
        try {
            const newEvento = await Evento.create({ cpfUser, data, codEvento });
            console.log(`Evento created: ${newEvento.id}`);
            res.status(201).json({ message: 'Evento cadastrado com sucesso.', evento: newEvento });
        } catch (error) {
            console.error('Error creating evento:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: "Código do evento já cadastrado." });
            }
            res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
        }
    }

    async update(req, res) {
        const { codEvento } = req.params;
        const { cpfUser, data } = req.body;
        console.log(`Attempting to update evento with codEvento: ${codEvento}`);
        try {
            const [updatedRows, [updatedEvento]] = await Evento.update(
                { cpfUser, data },
                { where: { codEvento }, returning: true }  // Utiliza codEvento para localizar o evento
            );
    
            if (updatedRows === 0) {
                console.log(`Evento not found with codEvento: ${codEvento}`);
                return res.status(404).json({ message: "Evento não encontrado." });
            }
            console.log(`Evento updated with codEvento: ${codEvento}`);
            res.json({ message: "Evento atualizado com sucesso.", evento: updatedEvento });
        } catch (error) {
            console.error("Update error:", error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: "Código do evento já cadastrado." });
            }
            console.error("Update error:", error);
            res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        console.log(`Attempting to delete evento: ${id}`);
        try {
            const deletedRows = await Evento.destroy({
                where: { id }
            });
            if (!deletedRows) {
                console.log(`Evento not found: ${id}`);
                return res.status(404).json({ message: "Evento não encontrado." });
            }
            console.log(`Evento deleted: ${id}`);
            res.json({ message: 'Evento deletado com sucesso.' });
        } catch (error) {
            console.error("Delete error:", error);
            res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
        }
    }

    async findByCodEvento(req, res) {
        const { codEvento } = req.params;
        try {
            const evento = await Evento.findOne({
                where: {
                    codEvento: codEvento  // Filtra os eventos pelo codEvento fornecido
                }
            });
            if (!evento) {
                return res.status(404).send({ message: "Evento não encontrado." });
            }
            res.send({ evento });
        } catch (error) {
            console.error("Error finding evento by codEvento:", error);
            res.status(500).send({ error: error.message });
        }
    }
    

    async listAll(req, res) {
        const { cpfUser } = req.params;  // Assegure-se de que o cpfUser é passado como um parâmetro na rota
        try {
            const eventos = await Evento.findAll({
                where: {
                    cpfUser: cpfUser  // Filtra os eventos onde o cpfUser é igual ao CPF fornecido
                }
            });
            if (eventos && eventos.length > 0) {
                res.send({ eventos });
            } else {
                res.status(404).send({ message: "Nenhum evento encontrado para este usuário." });
            }
        } catch (error) {
            console.error("Error listing eventos:", error);
            res.status(500).send({ error: error.message });
        }
    }
}

export default new EventoController();
