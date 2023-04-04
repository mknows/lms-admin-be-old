"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("modules", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			session_id: {
				type: Sequelize.UUID,
			},
			video_id: {
				type: Sequelize.ARRAY(Sequelize.UUID),
			},
			document_id: {
				type: Sequelize.ARRAY(Sequelize.UUID),
			},
			description: {
				allowNull: true,
				type: Sequelize.STRING,
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
		await queryInterface.dropTable("modules");
	},
};
