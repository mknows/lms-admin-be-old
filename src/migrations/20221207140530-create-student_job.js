"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("student_jobs", {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
			},
			student_id: {
				type: Sequelize.UUID,
			},
			job_id: {
				type: Sequelize.UUID,
			},
			status: {
				type: Sequelize.STRING,
			},
			created_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			created_by: {
				allowNull: true,
				type: Sequelize.UUID,
			},
			updated_by: {
				allowNull: true,
				type: Sequelize.UUID,
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("student_jobs");
	},
};
