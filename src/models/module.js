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
			this.belongsTo(models.MaterialEnrolled, {
				foreignKey: "id",
				targetKey: "id_referrer",
			});
			this.belongsTo(models.Session, {
				foreignKey: "session_id",
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
			video_id: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
			document_id: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
			description: DataTypes.STRING,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "modules",
		}
	);
	return Module;
};
