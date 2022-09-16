"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {}
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
			email: DataTypes.STRING,
			gender: DataTypes.STRING,
			phone: DataTypes.STRING,
			display_picture: DataTypes.STRING,
			address: DataTypes.STRING,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			tableName: "users",
		}
	);
	return User;
};
