"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {
		static associate(models) {}
	}
	Comment.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			df_id: DataTypes.UUID,
			author_id: DataTypes.STRING,
			content: DataTypes.STRING,
			teacher_like: DataTypes.ARRAY(DataTypes.STRING),
			student_like: DataTypes.ARRAY(DataTypes.STRING),
		},
		{
			sequelize,
			tableName: "comments",
		}
	);
	return Comment;
};
