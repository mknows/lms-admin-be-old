"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Admin extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Admin.init(
		{
			id: {
				type: DataTypes.STRING,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			email: DataTypes.STRING,
			name: DataTypes.STRING,
			password: DataTypes.STRING,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "admins",
		}
	);
	return Admin;
};
