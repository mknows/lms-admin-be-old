"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("discussion_forums", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      author_id: {
        type: Sequelize.UUID,
      },
      session_id: {
        type: Sequelize.UUID,
      },
      title: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("discussion_forums");
  },
};
