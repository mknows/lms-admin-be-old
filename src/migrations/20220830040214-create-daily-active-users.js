'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Daily_Active_Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
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
    await queryInterface.dropTable("Daily_Active_Users");
  }
};
