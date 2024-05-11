'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'birth_date', {
      type: Sequelize.STRING,
      allowNull: true // Permitir valores nulos temporariamente
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'birth_date');
  }
};
//adding teste