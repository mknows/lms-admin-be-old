'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pertemuans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.STRING
      },
      mk_id: {
        type: Sequelize.STRING
      },
      pertemuan_ke: {
        type: Sequelize.NUMBER
      },
      durasi: {
        type: Sequelize.NUMBER
      },
      is_sinkronus: {
        type: Sequelize.BOOLEAN
      },
      tipe: {
        type: Sequelize.STRING
      },
      deskripsi: {
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
    await queryInterface.dropTable('pertemuans');
  }
};