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
			teacher_like: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
			},
			student_like: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
			},
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "comments",
			timestamps: true,
			underscored: true,
			underscoredAll: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);
	return Comment;
};
