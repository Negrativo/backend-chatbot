import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";
import Conversation from "./Conversations.js";

class Message extends Model {}

Message.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		conversation_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Conversation,
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		type_name: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "Message",
		tableName: "Messages",
		timestamps: false,
	}
);

// Configurar associação após definir o modelo
Message.belongsTo(Conversation, {
	foreignKey: "conversation_id",
	as: "conversation",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

Conversation.hasMany(Message, {
	foreignKey: "conversation_id",
	as: "messages",
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
});

export default Message;
