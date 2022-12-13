"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class DiscussionForum extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.Comment, { foreignKey: "df_id" });
			this.hasMany(models.Reply, { foreignKey: "df_id" });
			this.belongsTo(models.User, { foreignKey: "author_id" });
			this.belongsTo(models.Session, { foreignKey: "session_id" });
		}
	}
	DiscussionForum.init(
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
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "discussion_forums",
		}
	);
	return DiscussionForum;
};
