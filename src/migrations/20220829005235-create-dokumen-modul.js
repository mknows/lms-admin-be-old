'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dokumen_moduls', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      modul_id: {
        type: Sequelize.STRING
      },
      dokumen_id: {
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
    await queryInterface.dropTable('dokumen_moduls');
  }
};