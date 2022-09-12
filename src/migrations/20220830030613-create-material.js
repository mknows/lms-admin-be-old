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
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("materials");
	},
};
