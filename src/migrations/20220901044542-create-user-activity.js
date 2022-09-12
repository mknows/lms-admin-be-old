"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("user_activities", {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primary_key: true,
			},
			activity: {
				type: Sequelize.STRING,
			},
			ip_address: {
				type: Sequelize.STRING,
			},
			referrer: {
				type: Sequelize.STRING,
			},
			device: {
				type: Sequelize.STRING,
			},
			platform: {
				type: Sequelize.STRING,
			},
			operating_system: {
				type: Sequelize.STRING,
			},
			source: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("User_Activities");
	},
};
