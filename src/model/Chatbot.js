import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class Chatbot extends Model {}

Chatbot.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		adminId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		sessionId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		timestamp: {
			type: DataTypes.TIME,
			allowNull: false,
			unique: true,
		},
	},
	{
		sequelize,
		modelName: "Chatbot",
		tableName: "Chatbot",
	}
);

export default Chatbot;
