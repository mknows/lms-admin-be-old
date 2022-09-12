"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Module extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.Video, {
				foreignKey: "id",
			});
			this.hasMany(models.Document, {
				foreignKey: "id",
			});
		}
	}
	Module.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			session_id: DataTypes.UUID,
			video_id: DataTypes.UUID,
			document_id: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "modules",
		}
	);
	return Module;
};
