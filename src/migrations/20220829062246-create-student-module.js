'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_modules', {
      module_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      student_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      time_taken: {
        type: Sequelize.DATE
      },
      score: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('student_modules');
  }
};