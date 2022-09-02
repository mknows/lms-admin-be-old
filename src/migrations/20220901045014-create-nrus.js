'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('new_registered_users', {
      id: {
        type: Sequelize.UUID,
        allowNull:false,
        primaryKey:true
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
    await queryInterface.dropTable('new_registered_users');
  }
};