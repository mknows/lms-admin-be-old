'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
      id:{
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
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
      approvedBy:{
        allowNull:true,
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('students');
  }
};