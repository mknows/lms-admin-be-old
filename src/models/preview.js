"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Preview extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Preview.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			name: DataTypes.STRING,
			original_name: DataTypes.STRING,
			url: DataTypes.STRING,
			description: DataTypes.TEXT,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
		},
		{
			sequelize,
			tableName: "previews",
		}
	);
	return Preview;
};
