'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users_Activities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      activity: Sequelize.STRING,
      ip_address: Sequelize.STRING,
      referrer: Sequelize.STRING,
      device: Sequelize.STRING,
      platform: Sequelize.STRING,
      operating_system: Sequelize.STRING,
      source: Sequelize.STRING,
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users_Activities');
  }
};
