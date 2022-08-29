'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pertanyaans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      pertanyaan: {
        type: Sequelize.STRING
      },
      pilihan: {
        type: Sequelize.STRING
      },
      jawaban: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pertanyaans');
  }
};