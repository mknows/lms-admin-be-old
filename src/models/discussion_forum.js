"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Discussion_forum extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Discussion_forum.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			author_id: DataTypes.UUID,
			session_id: DataTypes.UUID,
			title: DataTypes.STRING,
			content: DataTypes.STRING,
			teacher_like: DataTypes.ARRAY(DataTypes.UUID),
			student_like: DataTypes.ARRAY(DataTypes.UUID),
		},
		{
			sequelize,
			tableName: "discussion_forums",
		}
	);
	return Discussion_forum;
};
