"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("material_enrolleds", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			student_id: {
				type: Sequelize.UUID,
			},
			session_id: {
				type: Sequelize.UUID,
			},
			material_id: {
				type: Sequelize.UUID,
			},
			subject_id: {
				type: Sequelize.UUID,
			},
			description: {
				type: Sequelize.STRING,
			},
			status: {
				type: Sequelize.STRING,
			},
			id_referrer: {
				type: Sequelize.UUID,
			},
			type: {
				type: Sequelize.STRING,
			},
			score: {
				type: Sequelize.FLOAT,
			},
			activity_detail: {
				type: Sequelize.JSON,
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
		await queryInterface.dropTable("material_enrolleds");
	},
};
