"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("subjects", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			name: {
				type: Sequelize.STRING,
			},
			number_of_sessions: {
				type: Sequelize.INTEGER,
			},
			degree: {
				type: Sequelize.STRING,
			},
			level: {
				type: Sequelize.STRING,
			},
			lecturer: {
				type: Sequelize.ARRAY(Sequelize.UUID),
			},
			description: {
				type: Sequelize.STRING,
			},
			credit: {
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
		await queryInterface.dropTable("subjects");
	},
};
