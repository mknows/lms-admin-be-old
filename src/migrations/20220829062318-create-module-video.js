'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('module_videos', {
      module_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      video_id: {
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
    await queryInterface.dropTable('module_videos');
  }
};