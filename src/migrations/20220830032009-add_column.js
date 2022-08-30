'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
      'quizzes',
      'updatedBy',
     {type: Sequelize.DATE , allowNull: true}
    ),
    queryInterface.addColumn(
      'quizzes',
      'createdBy',
     {type: Sequelize.DATE , allowNull: true}
    ),
    ]
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
