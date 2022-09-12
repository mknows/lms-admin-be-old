"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("replies", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			df_id: {
				type: Sequelize.UUID,
			},
			comment_id: {
				type: Sequelize.UUID,
			},
			author_id: {
				type: Sequelize.UUID,
			},
			content: {
				type: Sequelize.TEXT,
			},
			teacher_like: {
				type: Sequelize.ARRAY(Sequelize.UUID),
			},
			student_like: {
				type: Sequelize.ARRAY(Sequelize.UUID),
			},
			created_at: {
				allowNull: false,
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
		await queryInterface.dropTable("replies");
	},
};
