"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("companies", {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
			},
			user_id: {
				type: Sequelize.UUID,
			},
			company_name: {
				type: Sequelize.STRING,
			},
			location: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable("companies");
	},
};
