"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Quiz extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Quiz.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			session_id: DataTypes.UUID,
			duration: DataTypes.INTEGER,
			description: DataTypes.TEXT,
			questions: DataTypes.JSON,
			answer: DataTypes.ARRAY(DataTypes.STRING),
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "quizzes",
		}
	);
	return Quiz;
};
