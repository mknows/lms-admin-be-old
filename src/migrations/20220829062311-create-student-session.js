"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("student_sessions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      session_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      student_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      date_present: {
        type: Sequelize.DATE,
      },
      final_score: {
        type: Sequelize.INTEGER,
      },
      present: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("student_sessions");
  },
};
