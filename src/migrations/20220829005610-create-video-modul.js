'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('video_moduls', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      modul_id: {
        type: Sequelize.STRING
      },
      video_id: {
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
    await queryInterface.dropTable('video_moduls');
  }
};