"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("events", {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING,
			},
			organizer: {
				type: Sequelize.STRING,
			},
			date_start: {
				type: Sequelize.DATE,
			},
			date_end: {
				type: Sequelize.DATE,
			},
			registration_closed: {
				type: Sequelize.DATE,
			},
			description: {
				type: Sequelize.TEXT,
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
		await queryInterface.dropTable("events");
	},
};
