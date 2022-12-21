"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("subjects", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			name: {
				type: Sequelize.STRING,
			},
			number_of_sessions: {
				type: Sequelize.INTEGER,
			},
			degree: {
				type: Sequelize.STRING,
			},
			level: {
				type: Sequelize.STRING,
			},
			lecturer: {
				type: Sequelize.ARRAY(Sequelize.UUID),
			},
			description: {
				type: Sequelize.STRING,
			},
			basic_competencies: {
				type: Sequelize.STRING,
			},
			indicator: {
				type: Sequelize.STRING,
			},
			study_experience: {
				type: Sequelize.STRING,
			},
			teaching_materials: {
				type: Sequelize.STRING,
			},
			credit: {
				type: Sequelize.INTEGER,
			},
			tools_needed: {
				type: Sequelize.STRING,
			},
			scoring: {
				type: Sequelize.STRING,
			},
			thumbnail: {
				type: Sequelize.STRING,
			},
			thumbnail_link: {
				type: Sequelize.STRING,
			},
			subject_code: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			analytic_index: {
				type: Sequelize.INTEGER,
			},
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
			updated_by: {
				allowNull: true,
				type: Sequelize.UUID,
			},
			created_by: {
				allowNull: true,
				type: Sequelize.UUID,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("subjects");
	},
};
