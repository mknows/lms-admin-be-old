'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('material_enrolleds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      student_id: {
        type: Sequelize.STRING
      },
      session_id: {
        type: Sequelize.STRING
      },
      student_id: {
        type: Sequelize.STRING
      },
      material_id: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      id_referrer: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      answer: {
        type: Sequelize.ARRAY(Sequelize.STRING)
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
    await queryInterface.dropTable('material_enrolleds');
  }
};