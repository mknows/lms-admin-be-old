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
				type: Sequelize.ARRAY(Sequelize.DATE),
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
			student_id: {
				type: Sequelize.UUID,
			},
			assessor_id: {
				type: Sequelize.UUID,
			},
			status: {
				type: Sequelize.BOOLEAN,
			},
			pick_time: {
				type: Sequelize.DATE,
			},
			score: {
				type: Sequelize.FLOAT,
			},
			score_description: {
				type: Sequelize.STRING,
			},
			created_at: {
				type: "TIMESTAMP",
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
				allowNull: false,
			},
			updated_at: {
				type: "TIMESTAMP",
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
				allowNull: false,
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
