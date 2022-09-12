"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("student_majors", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			major_id: {
				allowNull: false,
				type: Sequelize.UUID,
			},
			student_id: {
				allowNull: false,
				type: Sequelize.UUID,
			},
			status: {
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
		await queryInterface.dropTable("student_majors");
	},
};
