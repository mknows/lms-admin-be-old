"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("student_sessions", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			session_id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			student_id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			date_present: {
				type: Sequelize.DATE,
			},
			final_score: {
				type: Sequelize.INTEGER,
			},
			present: {
				type: Sequelize.BOOLEAN,
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
		await queryInterface.dropTable("student_sessions");
	},
};
