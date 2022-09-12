"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Daus extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Daus.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
		},
		{
			sequelize,
			tableName: "daily_active_users",
		}
	);
	return Daus;
};
