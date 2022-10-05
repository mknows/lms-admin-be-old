"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("assignments", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			session_id: {
				type: Sequelize.UUID,
			},
			duration: {
				type: Sequelize.INTEGER,
			},
			description: {
				type: Sequelize.TEXT,
			},
			content: {
				type: Sequelize.TEXT,
			},
			file_assignment: {
				type: Sequelize.ARRAY(Sequelize.UUID),
			},
			file_assignment_link: {
				type: Sequelize.ARRAY(Sequelize.UUID),
			},
			document_id: {
				type: Sequelize.ARRAY(Sequelize.UUID),
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
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
		await queryInterface.dropTable("assignments");
	},
};
