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
		},
		{
			sequelize,
			tableName: "majors",
		}
	);
	return Major;
};
