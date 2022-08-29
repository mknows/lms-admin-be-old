'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jurusan_murids', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      jurusan_id: {
        type: Sequelize.STRING
      },
      murid_id: {
        type: Sequelize.STRING
      },
      status: {
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
    await queryInterface.dropTable('jurusan_murids');
  }
};