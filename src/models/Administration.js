"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Administration extends Model {
		static associate(models) {
			this.belongsTo(models.User, {
				foreignKey: "user_id",
			});
		}
	}

	Administration.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			user_id: {
				allowNull: false,
				type: DataTypes.UUID,
				references: {
					model: "User",
					key: "id",
				},
			},
			nin: DataTypes.STRING,
			study_program: DataTypes.STRING,
			semester: DataTypes.STRING,
			residence_address: DataTypes.STRING,
			nin_address: DataTypes.STRING,
			phone: DataTypes.STRING,
			birth_place: DataTypes.STRING,
			domicile: DataTypes.STRING,
			financier: DataTypes.STRING,
			father_name: DataTypes.STRING,
			mother_name: DataTypes.STRING,
			father_occupation: DataTypes.STRING,
			mother_oocupation: DataTypes.STRING,
			job: DataTypes.STRING,
			income: DataTypes.STRING,
			father_income: DataTypes.STRING,
			mother_income: DataTypes.STRING,

			// File
			integrity_fact: DataTypes.STRING,
			nin_card: DataTypes.STRING,
			family_card: DataTypes.STRING,
			sertificate: DataTypes.STRING,
			photo: DataTypes.STRING,
			transcript: DataTypes.STRING,
			recomendation_letter: DataTypes.STRING,

			is_approved: DataTypes.STRING,
			approved_by: DataTypes.UUID,
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updated_at: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			modelName: "Administration",
			tableName: "Administrations",
		}
	);

	return Administration;
};
