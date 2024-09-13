import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class Agendamento extends Model {}

Agendamento.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		cpfUser: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: "Users",
				key: "cpf",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		nomeUser: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		dataInicial: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		dataFinal: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		codEvento: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		sequelize,
		modelName: "Agendamento",
		tableName: "Agendamentos",
	}
);

export default Agendamento;
