"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Glossary extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Major, {
				foreignKey: "major_id",
			});
		}
	}
	Glossary.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			word: DataTypes.STRING,
			definition: DataTypes.TEXT,
			major_id: DataTypes.UUID,
			type: DataTypes.STRING,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "Glossaries",
		}
	);
	return Glossary;
};
