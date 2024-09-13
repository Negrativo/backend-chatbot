import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class Event extends Model {}

Event.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		sender_id: {
			type: DataTypes.STRING, // Ajuste para o tipo apropriado conforme seu banco de dados
			allowNull: false,
		},
		type_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		timestamp: {
			type: DataTypes.DATE, // Verifique se está no formato de data correto no banco
			allowNull: false,
		},
		intent_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		action_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		data: {
			type: DataTypes.JSONB, // Supondo que o campo "data" seja do tipo JSON
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "Event",
		tableName: "events",
		timestamps: false, // Se não houver campos createdAt e updatedAt
	}
);

export default Event;
