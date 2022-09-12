"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class StudentSession extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	StudentSession.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			subject_id: DataTypes.UUID,
			session_id: DataTypes.UUID,
			date_present: DataTypes.DATE,
			final_score: DataTypes.FLOAT,
			present: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			tableName: "student_sessions",
		}
	);
	return StudentSession;
};
