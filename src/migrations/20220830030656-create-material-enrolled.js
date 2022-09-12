"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("material_enrolleds", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      student_id: {
        type: Sequelize.UUID,
      },
      session_id: {
        type: Sequelize.UUID,
      },
      student_id: {
        type: Sequelize.UUID,
      },
      material_id: {
        type: Sequelize.UUID,
      },
      subject_id: {
        type: Sequelize.UUID,
      },
      description: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      id_referrer: {
        type: Sequelize.UUID,
      },
      type: {
        type: Sequelize.STRING,
      },
      score: {
        type: Sequelize.FLOAT,
      },
      activity_detail: {
        type: Sequelize.JSON,
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
    await queryInterface.dropTable("material_enrolleds");
  },
};
