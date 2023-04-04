"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("students", {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
			},
			user_id: {
				type: Sequelize.UUID,
			},
			supervisor_id: {
				type: Sequelize.UUID,
			},
			semester: {
				allowNull: false,
				type: Sequelize.INTEGER,
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
		await queryInterface.dropTable("students");
	},
};
