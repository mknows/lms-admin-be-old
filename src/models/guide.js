"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Guide extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Guide.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			type: DataTypes.STRING,
			description: DataTypes.TEXT,
			title: DataTypes.STRING,
			content: DataTypes.JSON,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "Guides",
		}
	);
	return Guide;
};
