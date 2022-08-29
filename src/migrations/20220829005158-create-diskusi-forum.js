'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('diskusi_forums', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      penulis_id: {
        type: Sequelize.STRING
      },
      pertemuan_id: {
        type: Sequelize.STRING
      },
      judul: {
        type: Sequelize.STRING
      },
      konten: {
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
    await queryInterface.dropTable('diskusi_forums');
  }
};