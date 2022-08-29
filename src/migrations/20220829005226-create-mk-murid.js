'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mk_murids', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        type: Sequelize.NUMBER
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