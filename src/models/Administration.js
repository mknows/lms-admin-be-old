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
			full_name: DataTypes.STRING,
			email: DataTypes.STRING,
			nin: DataTypes.STRING,
			study_program: DataTypes.STRING,
			semester: DataTypes.STRING,
			nin_address: DataTypes.STRING,
			residence_address: DataTypes.STRING,
			birth_place: DataTypes.STRING,
			birth_date: DataTypes.STRING,
			phone: DataTypes.STRING,
			gender: DataTypes.STRING,
			nsn: DataTypes.STRING,
			university_of_origin: DataTypes.STRING,

			father_name: DataTypes.STRING,
			father_occupation: DataTypes.STRING,
			father_income: DataTypes.STRING,
			mother_name: DataTypes.STRING,
			mother_occupation: DataTypes.STRING,
			mother_income: DataTypes.STRING,

			occupation: DataTypes.STRING,
			income: DataTypes.STRING,
			living_partner: DataTypes.STRING,
			financier: DataTypes.STRING,

			// File
			integrity_pact: DataTypes.STRING,
			integrity_pact_link: DataTypes.STRING,
			nin_card: DataTypes.STRING,
			nin_card_link: DataTypes.STRING,
			family_card: DataTypes.STRING,
			family_card_link: DataTypes.STRING,
			certificate: DataTypes.STRING,
			certificate_link: DataTypes.STRING,
			photo: DataTypes.STRING,
			photo_link: DataTypes.STRING,
			transcript: DataTypes.STRING,
			transcript_link: DataTypes.STRING,
			recommendation_letter: DataTypes.STRING,
			recommendation_letter_link: DataTypes.STRING,

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
			deleted_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Administration",
			tableName: "Administrations",
		}
	);

	return Administration;
};
