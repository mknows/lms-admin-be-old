"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("student_datapools", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			user_id: {
				type: Sequelize.UUID,
			},
			student_id: {
				type: Sequelize.UUID,
			},
			semester: {
				type: Sequelize.INTEGER,
			},
			gpa: {
				type: Sequelize.FLOAT,
			},
			quickest_subject: {
				type: Sequelize.INTEGER,
			},
			most_frequent_subject: {
				type: Sequelize.INTEGER,
			},
			major: {
				type: Sequelize.INTEGER,
			},
			highest_grade_subject: {
				type: Sequelize.INTEGER,
			},
			slowest_subject: {
				type: Sequelize.INTEGER,
			},
			least_frequent_subject: {
				type: Sequelize.INTEGER,
			},
			lowest_grade_subject: {
				type: Sequelize.INTEGER,
			},
			gender: {
				type: Sequelize.INTEGER,
			},
			age: {
				type: Sequelize.INTEGER,
			},
			job_recommendation: {
				type: Sequelize.INTEGER,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			deleted_at: {
				type: Sequelize.DATE,
				allowNull: true,
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
		await queryInterface.dropTable("student_datapools");
	},
};
