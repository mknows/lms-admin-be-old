"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("documents", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			content: {
				type: Sequelize.TEXT,
			},
			file: {
				type: Sequelize.BLOB,
			},
			link: {
				type: Sequelize.TEXT,
			},
			description: {
				type: Sequelize.TEXT,
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
		await queryInterface.dropTable("documents");
	},
};
