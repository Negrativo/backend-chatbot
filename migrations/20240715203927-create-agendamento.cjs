"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Remove a coluna 'data'
		await queryInterface.removeColumn("Events", "data");

		// Adiciona a coluna 'startDate'
		await queryInterface.addColumn("Events", "dataInicial", {
			allowNull: false,
			type: Sequelize.DATE,
		});

		// Adiciona a coluna 'endDate'
		await queryInterface.addColumn("Events", "dataFinal", {
			allowNull: false,
			type: Sequelize.DATE,
		});
		await queryInterface.addColumn("Events", "nomeUser", {
			allowNull: false,
			type: Sequelize.STRING,
		});
	},

	async down(queryInterface, Sequelize) {
		// Remove as colunas 'startDate' e 'endDate'
		await queryInterface.removeColumn("Events", "dataInicial");
		await queryInterface.removeColumn("Events", "dataFinal");
		await queryInterface.removeColumn("Events", "nomeUser");

		// Adiciona a coluna 'data' novamente
		await queryInterface.addColumn("Events", "data", {
			type: Sequelize.STRING,
			allowNull: false,
		});
	},
};
