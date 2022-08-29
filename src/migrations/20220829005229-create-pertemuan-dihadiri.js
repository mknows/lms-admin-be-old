'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pertemuan_murids', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      pertemuan_id: {
        type: Sequelize.STRING
      },
      murid_id: {
        type: Sequelize.STRING
      },
      tgl_hadir: {
        type: Sequelize.DATE
      },
      nilai_akhir: {
        type: Sequelize.INTEGER
      },
      hadir: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('pertemuan_murids');
  }
};