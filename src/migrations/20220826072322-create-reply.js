'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('replies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.STRING
      },
      df_id: {
        type: Sequelize.STRING
      },
      reply_ke: {
        type: Sequelize.STRING
      },
      penulis_id: {
        type: Sequelize.STRING
      },
      konten: {
        type: Sequelize.STRING
      },
      dosen_like: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      murid_like: {
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
    await queryInterface.dropTable('replies');
  }
};