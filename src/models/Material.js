"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Material extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Material.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			session_id: DataTypes.UUID,
			subject_id: DataTypes.UUID,
			description: DataTypes.STRING,
			type: DataTypes.STRING,
			id_referrer: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "materials",
		}
	);
	return Material;
};
