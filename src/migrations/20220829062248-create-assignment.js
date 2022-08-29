'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assignments', { 
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      session_id: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      content: {
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
    await queryInterface.dropTable('assignments');
  }
};