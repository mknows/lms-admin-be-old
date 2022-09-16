"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("materials", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			session_id: {
				type: Sequelize.UUID,
			},
			subject_id: {
				type: Sequelize.UUID,
			},
			description: {
				type: Sequelize.STRING,
			},
			type: {
				type: Sequelize.STRING,
			},
			id_referrer: {
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
		await queryInterface.dropTable("materials");
	},
};
