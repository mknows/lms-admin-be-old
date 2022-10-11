"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class MaterialEnrolled extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	MaterialEnrolled.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			student_id: DataTypes.UUID,
			session_id: DataTypes.UUID,
			material_id: { type: DataTypes.UUID },
			subject_id: DataTypes.UUID,
			description: DataTypes.STRING,
			status: DataTypes.STRING,
			id_referrer: DataTypes.STRING,
			type: DataTypes.STRING,
			score: DataTypes.INTEGER,
			activity_detail: DataTypes.JSON,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "material_enrolleds",
		}
	);
	return MaterialEnrolled;
};
