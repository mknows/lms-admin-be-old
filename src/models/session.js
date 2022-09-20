"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Session extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// this.hasMany(models.Module, {
			// 	foreignKey: "session_id",
			// });
		}
	}
	Session.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			subject_id: DataTypes.STRING,
			session_no: DataTypes.NUMBER,
			duration: DataTypes.INTEGER,
			is_sync: DataTypes.BOOLEAN,
			type: DataTypes.STRING,
			description: DataTypes.STRING,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "sessions",
		}
	);
	return Session;
};
