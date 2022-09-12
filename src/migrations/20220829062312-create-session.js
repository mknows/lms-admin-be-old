"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("sessions", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			subject_id: {
				type: Sequelize.UUID,
			},
			session_no: {
				type: Sequelize.INTEGER,
			},
			duration: {
				type: Sequelize.INTEGER,
			},
			is_sync: {
				type: Sequelize.BOOLEAN,
			},
			type: {
				type: Sequelize.STRING,
			},
			description: {
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
		await queryInterface.dropTable("sessions");
	},
};
