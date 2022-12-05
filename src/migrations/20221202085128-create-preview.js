"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("previews", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			original_name: {
				type: Sequelize.STRING,
			},
			name: {
				type: Sequelize.STRING,
			},
			url: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable("previews");
	},
};
