"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameTable("Events", "Agendamentos");
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameTable("Agendamentos", "Events");
	},
};
