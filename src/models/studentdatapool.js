"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class StudentDatapool extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.User, { foreignKey: "user_id" });
			this.belongsTo(models.Student, { foreignKey: "student_id" });
		}
	}
	StudentDatapool.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			user_id: DataTypes.UUID,
			student_id: DataTypes.UUID,
			semester: DataTypes.INTEGER,
			gpa: DataTypes.FLOAT,
			quickest_subject: DataTypes.INTEGER,
			most_frequent_subject: DataTypes.INTEGER,
			major: DataTypes.INTEGER,
			highest_grade_subject: DataTypes.INTEGER,
			slowest_subject: DataTypes.INTEGER,
			least_frequent_subject: DataTypes.INTEGER,
			lowest_grade_subject: DataTypes.INTEGER,
			gender: DataTypes.INTEGER,
			age: DataTypes.INTEGER,
			job_recommendation: DataTypes.INTEGER,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "student_datapool",
		}
	);
	return StudentDatapool;
};
