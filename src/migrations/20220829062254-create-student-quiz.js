'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_quizzes', {
      quizz_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      murid_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      time_taken: {
        type: Sequelize.DATE
      },
      time_submitted: {
        type: Sequelize.DATE
      },
      score: {
        type: Sequelize.INTEGER
      },
      answer: {
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
    await queryInterface.dropTable('student_quizzes');
  }
};