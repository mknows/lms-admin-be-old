'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
      id:{
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      firebaseUID: {
        type: Sequelize.STRING
      },
      program:{
        type: Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      major_id:{
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING)
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
    await queryInterface.dropTable('students');
  }
};