"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Major extends Model {
		static associate(models) {
			this.belongsToMany(models.Subject, {
				through: models.MajorSubject,
				foreignKey: "major_id",
			});
		}
	}
	Major.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			name: DataTypes.STRING,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "majors",
			timestamps: true,
			underscored: true,
			underscoredAll: true,
		}
	);
	return Major;
};
