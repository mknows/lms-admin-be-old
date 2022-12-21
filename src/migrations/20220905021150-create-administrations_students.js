"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Administrations", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			user_id: {
				allowNull: false,
				type: Sequelize.UUID,
			},
			full_name: Sequelize.STRING,
			email: Sequelize.STRING,
			nin: Sequelize.STRING,
			study_program: Sequelize.STRING,
			semester: Sequelize.STRING,
			nin_address: Sequelize.STRING,
			residence_address: Sequelize.STRING,
			birth_place: Sequelize.STRING,
			birth_date: Sequelize.STRING,
			phone: Sequelize.STRING,
			gender: Sequelize.STRING,
			nsn: Sequelize.STRING,
			university_of_origin: Sequelize.STRING,

			father_name: Sequelize.STRING,
			father_occupation: Sequelize.STRING,
			father_income: Sequelize.STRING,
			mother_name: Sequelize.STRING,
			mother_occupation: Sequelize.STRING,
			mother_income: Sequelize.STRING,

			occupation: Sequelize.STRING,
			income: Sequelize.STRING,
			living_partner: Sequelize.STRING,
			financier: Sequelize.STRING,

			// File
			integrity_pact: Sequelize.STRING,
			integrity_pact_link: Sequelize.STRING,
			nin_card: Sequelize.STRING,
			nin_card_link: Sequelize.STRING,
			family_card: Sequelize.STRING,
			family_card_link: Sequelize.STRING,
			certificate: Sequelize.STRING,
			certificate_link: Sequelize.STRING,
			photo: Sequelize.STRING,
			photo_link: Sequelize.STRING,
			transcript: Sequelize.STRING,
			transcript_link: Sequelize.STRING,
			recommendation_letter: Sequelize.STRING,
			recommendation_letter_link: Sequelize.STRING,
			last_certificate_diploma: Sequelize.STRING,
			last_certificate_diploma_link: Sequelize.STRING,
			parent_statement: Sequelize.STRING,
			parent_statement_link: Sequelize.STRING,
			statement: Sequelize.STRING,
			statement_link: Sequelize.STRING,

			is_approved: Sequelize.JSON,
			approved_by: Sequelize.UUID,

			degree: Sequelize.STRING,
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Administrations");
	},
};
