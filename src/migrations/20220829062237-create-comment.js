"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("comments", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			df_id: {
				type: Sequelize.UUID,
			},
			author_id: {
				type: Sequelize.UUID,
			},
			content: {
				type: Sequelize.STRING,
			},
			teacher_like: {
				type: Sequelize.ARRAY(Sequelize.STRING),
			},
			student_like: {
				type: Sequelize.ARRAY(Sequelize.STRING),
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
		await queryInterface.dropTable("comments");
	},
};
