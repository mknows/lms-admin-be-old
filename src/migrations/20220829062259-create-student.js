
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Students', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID
      },
      major_id: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.UUID)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Students');
  }
};