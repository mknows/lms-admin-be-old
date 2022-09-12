"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("major_subjects", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      major_id: {
        type: Sequelize.UUID,
      },
      subject_id: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable("major_subjects");
  },
};
