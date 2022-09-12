"use strict";

const { sequelize } = require("../models");

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("student_subjects", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			subject_id: {
				type: Sequelize.UUID,
			},
			student_id: {
				type: Sequelize.UUID,
			},
			date_taken: {
				type: Sequelize.DATE,
			},
			date_finished: {
				type: Sequelize.DATE,
			},
			status: {
				type: Sequelize.STRING,
			},
			final_score: {
				type: Sequelize.FLOAT,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
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
		await queryInterface.dropTable("student_subjects");
	},
};
