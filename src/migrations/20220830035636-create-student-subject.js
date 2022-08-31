'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_subjects', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      subject_id: {
        type: Sequelize.UUID
      },
      student_id: {
        type: Sequelize.UUID
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