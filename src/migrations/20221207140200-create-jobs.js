"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("jobs", {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
			},
			company_id: {
				type: Sequelize.UUID,
			},
			requirements: {
				type: Sequelize.ARRAY(Sequelize.STRING),
			},
			salary: {
				type: Sequelize.INTEGER,
			},
			deadline: {
				type: Sequelize.DATE,
			},
			type: {
				type: Sequelize.STRING,
			},
			period: {
				type: Sequelize.STRING,
			},
			position: {
				type: Sequelize.STRING,
			},
			work_days: {
				type: Sequelize.STRING,
			},
			work_hour: {
				type: Sequelize.STRING,
			},
			url: {
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
		await queryInterface.dropTable("jobs");
	},
};
