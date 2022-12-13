"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Meetings", {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
			},
			meeting_type: {
				type: Sequelize.STRING,
			},
			time: {
				type: Sequelize.DATE,
			},
			place: {
				type: Sequelize.STRING,
			},
			topic: {
				type: Sequelize.STRING,
			},
			description: {
				type: Sequelize.STRING,
			},
			user_id: {
				type: Sequelize.UUID,
			},
			assessor_id: {
				type: Sequelize.UUID,
			},
			status: {
				type: Sequelize.BOOLEAN,
			},
			score: {
				type: Sequelize.FLOAT,
			},
			score_description: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable("Meetings");
	},
};
