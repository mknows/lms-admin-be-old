"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Service extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Service.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			user_id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			name: DataTypes.STRING,
			nim: DataTypes.STRING,
			email: DataTypes.STRING,
			message: DataTypes.TEXT,
			priority: DataTypes.STRING,
			document: DataTypes.STRING,
			document_name: DataTypes.STRING,
			document_link: DataTypes.STRING,
			status: DataTypes.STRING,
		},
		{
			sequelize,
			tableName: "Services",
		}
	);
	return Service;
};
