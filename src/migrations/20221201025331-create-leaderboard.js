"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("leaderboards", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			user_id: {
				type: Sequelize.UUID,
			},
			user_role: {
				type: Sequelize.STRING,
			},
			forum_score: {
				type: Sequelize.FLOAT,
			},
			gpa: {
				type: Sequelize.FLOAT,
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
		await queryInterface.dropTable("leaderboards");
	},
};
