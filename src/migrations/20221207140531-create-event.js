"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("events", {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
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
			capacity: {
				type: Sequelize.INTEGER,
			},
			price: {
				type: Sequelize.INTEGER,
			},
			type: {
				type: Sequelize.STRING,
			},
			material: {
				type: Sequelize.ARRAY(Sequelize.STRING),
			},
			description: {
				type: Sequelize.TEXT,
			},
			speaker_details: {
				type: Sequelize.JSON,
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
