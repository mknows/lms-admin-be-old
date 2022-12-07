"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Lecturer extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.Major, {
				foreignKey: "head_of_major",
			});
			this.belongsTo(models.User, {
				foreignKey: "user_id",
			});
		}
	}
	Lecturer.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			user_id: DataTypes.UUID,
			is_lecturer: DataTypes.BOOLEAN,
			is_mentor: DataTypes.BOOLEAN,
			title: DataTypes.STRING,
			approvedBy: DataTypes.UUID,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "lecturers",
		}
	);
	return Lecturer;
};
