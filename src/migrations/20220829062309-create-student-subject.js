'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_subjects', {
      subject_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      student_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      date_taken: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      final_score: {
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
    await queryInterface.dropTable('student_subjects');
  }
};