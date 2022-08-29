'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('module_documents', {
      module_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      document_id: {
        allowNull: false,
        primaryKey: true,
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
    await queryInterface.dropTable('module_documents');
  }
};