"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class StudentJob extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	StudentJob.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			student_id: DataTypes.UUID,
			job_id: DataTypes.UUID,
			status: DataTypes.STRING,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "student_jobs",
		}
	);
	return StudentJob;
};
