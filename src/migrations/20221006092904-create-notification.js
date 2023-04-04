"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("notifications", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			title: {
				type: Sequelize.STRING,
			},
			notification: {
				type: Sequelize.STRING,
			},
			is_read: {
				type: Sequelize.BOOLEAN,
			},
			user_id: {
				type: Sequelize.UUID,
			},
			type: {
				type: Sequelize.STRING,
			},
			sender_id: {
				type: Sequelize.UUID,
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
				allowNull: false,
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
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("notifications");
	},
};
