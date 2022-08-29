'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kuis_murids', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      murid_id: {
        type: Sequelize.STRING
      },
      waktu_pengambilan: {
        type: Sequelize.DATE
      },
      waktu_pengumpulan: {
        type: Sequelize.DATE
      },
      nilai: {
        type: Sequelize.INTEGER
      },
      jawaban: {
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
    await queryInterface.dropTable('kuis_murids');
  }
};