"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Services", {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
			},
			user_id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING,
			},
			nim: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},
			message: {
				type: Sequelize.TEXT,
			},
			priority: {
				type: Sequelize.STRING,
			},
			document: {
				type: Sequelize.STRING,
			},
			document_name: {
				type: Sequelize.STRING,
			},
			document_link: {
				type: Sequelize.STRING,
			},
			status: {
				type: Sequelize.STRING,
			},
			created_at: {
				type: "TIMESTAMP",
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
				allowNull: true,
			},
			updated_at: {
				type: "TIMESTAMP",
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
				allowNull: false,
			},
			deleted_at: {
				type: "TIMESTAMP",
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
				allowNull: true,
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
		await queryInterface.dropTable("Services");
	},
};
