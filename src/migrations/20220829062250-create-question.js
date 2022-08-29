'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      questions: {
        type: Sequelize.STRING
      },
      choice: {
        type: Sequelize.STRING
      },
      answer: {
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
    await queryInterface.dropTable('questions');
  }
};