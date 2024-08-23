import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class Conversation extends Model {}

Conversation.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		slots: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		intent_names: {
			type: DataTypes.JSON,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "Conversation",
		tableName: "Conversations",
		timestamps: false,
	}
);

export default Conversation;
