"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Certificate extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Certificate.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			user_id: DataTypes.UUID,
			student_id: DataTypes.UUID,
			subject_id: DataTypes.UUID,
			id_certificate: DataTypes.STRING,
			file: DataTypes.STRING,
			link: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Certificate",
			tableName: "Certificates",
		}
	);
	return Certificate;
};
