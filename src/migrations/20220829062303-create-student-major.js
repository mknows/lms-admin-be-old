"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("student_majors", {
      major_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      student_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      status: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("student_majors");
  },
};
