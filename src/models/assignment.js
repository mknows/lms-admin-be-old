"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Assignment extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Assignment.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			session_id: DataTypes.UUID,
			duration: DataTypes.INTEGER,
			description: DataTypes.TEXT,
			content: DataTypes.TEXT,
			document_id: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "assignments",
		}
	);
	return Assignment;
};
