import Conversation from "../model/Conversations.js";
import Message from "../model/Message.js";
import User from "../model/User.js"; // Importe o modelo User

class ConversatiosController {
	async saveConversation(req, res) {
		const { messages, slots, intent_names } = req.body;
		try {
			console.log(slots, intent_names);
			const newConversation = await Conversation.create({ messages, slots, intent_names });
			console.log(`Conversation created: ${newConversation.id}`);

			if (newConversation.id) {
				const messagesMap = messages
					.map((message) => {
						if (message.type_name === "user" || message.type_name === "bot") {
							const date = new Date(message.timestamp * 1000);
							return {
								message: message.type_name,
								text: message.text,
								timestamp: date.toISOString(),
							};
						}
					})
					.filter((message) => message != undefined);

				console.log("message: ", messagesMap);
				messagesMap.forEach((element) => {
					const messageData = {
						conversation_id: newConversation.id,
						type_name: element.message,
						text: element.text,
						timestamp: element.timestamp,
					};
					console.log(messageData);
					Message.create(messageData);
				});
			}

			res.status(201).json({ message: "Conversa cadastrada com sucesso.", conversa: newConversation.id });

			// Message.create({})
		} catch (error) {
			console.error("Error creating conversation:", error);
			res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
		}
	}

	async findMessages(req, res) {
		const { cpf } = req.params;
		try {
			const user = await User.findOne({ where: { cpf } });
			if (!user) {
				return res.status(404).json({ message: "Usuário não encontrado." });
			}
			res.json({ user });
		} catch (error) {
			console.error("Erro ao encontrar usuário por CPF:", error);
			res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
		}
	}
}

export default new ConversatiosController();
