'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lecturers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      firebaseUID: {
        type: Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      is_lecturer: {
        type: Sequelize.BOOLEAN
      },
      is_mentor: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedBy:{
        allowNull:true,
        type: Sequelize.STRING
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lecturers');
  }
};