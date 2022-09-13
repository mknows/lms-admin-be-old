"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Daus extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Daus.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			user_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
				references: {
					model: "Users",
					key: "id",
				},
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
				field: "created_at",
			},
			updated_at: {
				allowNull: false,
				type: DataTypes.DATE,
				field: "updated_at",
			},
		},
		{
			sequelize,
			tableName: "daily_active_users",
			timestamps: true,
			underscored: true,
			underscoredAll: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);
	return Daus;
};
