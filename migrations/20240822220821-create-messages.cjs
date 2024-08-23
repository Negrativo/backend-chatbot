"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Messages", {
			id: {
				type: Sequelize.BIGINT,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			conversation_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Conversations",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			type_name: {
				type: Sequelize.STRING(10),
				allowNull: false,
			},
			text: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			timestamp: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Messages");
	},
};
