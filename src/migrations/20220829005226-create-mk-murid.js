'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mk_murids', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      mk_id: {
        type: Sequelize.STRING
      },
      murid_id: {
        type: Sequelize.STRING
      },
      tgl_diambil: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      nilai_akhir: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('mk_murids');
  }
};