"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("lecturers", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			is_lecturer: {
				type: Sequelize.BOOLEAN,
			},
			is_mentor: {
				type: Sequelize.BOOLEAN,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			approvedBy: {
				allowNull: true,
				type: Sequelize.STRING,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("lecturers");
	},
};
