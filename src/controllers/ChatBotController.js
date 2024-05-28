
import Chatbot from '../model/Chatbot.js'; // Importe o modelo Chatbot

class ChatbotController {

    async create(req, res) {
        const { name, adminId, timestamp, sessionId } = req.body;
        try {
            const newChatbot = await Chatbot.create({ name, adminId, timestamp, sessionId });
            console.log(`Chatbot created: ${newChatbot.id}`);
            res.status(201).json({ message: 'Chatbot cadastrado com sucesso.', chatbot: newChatbot });
        } catch (error) {
            console.error('Error creating chatbot:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: "Código do chatbot já cadastrado." });
            }
            res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
        }
    }

    async findAll(req, res) {
        const adminId = req.adminId
        try {
            const chats = await Chatbot.findAll({
                where: {
                    adminId: adminId  // Filtra os chats que forem do admin logado
                }
            });
            if (chats && chats.length > 0) {
                res.send({ chats });
            } else {
                res.status(404).send({ message: "Nenhum chat encontrado para este administrador." });
            }
        } catch (error) {
            console.error("Error listing chats:", error);
            res.status(500).send({ error: "Houve um problema interno, tente novamente mais tarde." });
        }
    }
}

export default new ChatbotController();
