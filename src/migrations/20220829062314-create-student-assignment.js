'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_assignments', {
      tugas_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      murid_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      date_taken: {
        type: Sequelize.DATE
      },
      date_submitted: {
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
    await queryInterface.dropTable('student_assignments');
  }
};