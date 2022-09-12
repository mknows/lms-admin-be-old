"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("replies", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      df_id: {
        type: Sequelize.UUID,
      },
      comment_id: {
        type: Sequelize.UUID,
      },
      author_id: {
        type: Sequelize.UUID,
      },
      content: {
        type: Sequelize.TEXT,
      },
      teacher_like: {
        type: Sequelize.ARRAY(Sequelize.UUID),
      },
      student_like: {
        type: Sequelize.ARRAY(Sequelize.UUID),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("replies");
  },
};
