"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			this.hasOne(models.Lecturer);
			this.hasMany(models.DiscussionForum, { foreignKey: "author_id" });
			this.hasMany(models.Comment, { foreignKey: "author_id" });
			this.hasMany(models.Reply, { foreignKey: "author_id" });
		}
	}
	User.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			firebase_uid: DataTypes.STRING,
			full_name: DataTypes.STRING,
			username: DataTypes.STRING,
			email: DataTypes.STRING,
			gender: DataTypes.STRING,
			phone: DataTypes.STRING,
			display_picture: DataTypes.STRING,
			display_picture_link: DataTypes.STRING,
			address: DataTypes.STRING,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
		},
		{
			sequelize,
			tableName: "users",
		}
	);
	return User;
};
