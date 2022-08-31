'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      df_id: {
        type: Sequelize.STRING
      },
      reply_to: {
        type: Sequelize.STRING
      },
      penulis_id: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      teacher_like: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      student_like: {
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
        type: Sequelize.STRING
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comments');
  }
};