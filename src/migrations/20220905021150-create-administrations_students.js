'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Administrations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      nin: Sequelize.STRING,
      study_program: Sequelize.STRING,
      semester: Sequelize.STRING,
      residence_address: Sequelize.STRING,
      nin_address: Sequelize.STRING,
      phone: Sequelize.STRING,
      birth_place: Sequelize.STRING,
      domicile: Sequelize.STRING,
      financier: Sequelize.STRING,
      father_name: Sequelize.STRING,
      mother_name: Sequelize.STRING,
      father_occupation: Sequelize.STRING,
      mother_oocupation: Sequelize.STRING,
      job: Sequelize.STRING,
      income: Sequelize.STRING,
      father_income: Sequelize.STRING,
      mother_income: Sequelize.STRING,

      // File
      integrity_fact: Sequelize.STRING,
      nin_card: Sequelize.STRING,
      family_card: Sequelize.STRING,
      sertificate: Sequelize.STRING,
      photo: Sequelize.STRING,
      transcript: Sequelize.STRING,
      recomendation_letter: Sequelize.STRING,

      is_approved: Sequelize.STRING,
      approved_by: Sequelize.UUID,
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Administrations');
  }
};