'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('modules', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      session_id: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER
      },
      video_id: {
        type: Sequelize.STRING
      },
      dokumen_id: {
        type: Sequelize.STRING
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
        type:Sequelize.DATE
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('modules');
  }
};