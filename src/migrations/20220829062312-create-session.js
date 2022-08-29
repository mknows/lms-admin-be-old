'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      subject_id: {
        type: Sequelize.STRING
      },
      session_no: {
        type: Sequelize.INTEGER
      },
      duration: {
        type: Sequelize.INTEGER
      },
      is_sync: {
        type: Sequelize.BOOLEAN
      },
      type: {
        type: Sequelize.STRING
      },
      description: {
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
    await queryInterface.dropTable('sessions');
  }
};