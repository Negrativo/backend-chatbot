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

	async findConversation(req, res) {
		try {
			const conversations = await Conversation.findAll();
			if (!conversations) {
				return res.status(404).json({ message: "Não foram encontradas conversas." });
			}
			res.json({ conversations });
		} catch (error) {
			console.error("Erro ao encontrar conversas:", error);
			res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
		}
	}

	async findMessages(req, res) {
		const { conversationId } = req.query;
		console.log("1211- ", conversationId);
		try {
			const messages = await Message.findAll({ where: { conversation_id: conversationId } });
			if (!messages || messages.length === 0) {
				return res.status(404).json({ message: "Não foram encontradas mensagens para essa conversa." });
			}
			res.json({ messages: messages });
		} catch (error) {
			console.error("Erro ao encontrar mensagens:", error);
			res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
		}
	}
}

export default new ConversatiosController();
