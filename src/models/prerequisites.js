"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Prerequisite extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Prerequisite.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			subject_id: DataTypes.UUID,
			prerequisite_subject_id: DataTypes.UUID,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "prerequisites",
		}
	);
	return Prerequisite;
};
