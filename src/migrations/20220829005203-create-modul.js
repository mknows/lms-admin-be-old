'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('moduls', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      pertemuan_id: {
        type: Sequelize.STRING
      },
      durasi: {
        type: Sequelize.STRING
      },
      video_id: {
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
    await queryInterface.dropTable('moduls');
  }
};