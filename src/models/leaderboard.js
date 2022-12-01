"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Leaderboard extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Leaderboard.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			user_id: DataTypes.STRING,
			user_role: DataTypes.STRING,
			forum_score: { type: DataTypes.FLOAT, defaultValue: 0 },
			gpa: { type: DataTypes.FLOAT, defaultValue: 0 },
			final_score: { type: DataTypes.FLOAT, defaultValue: 0 },
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "leaderboards",
		}
	);
	return Leaderboard;
};
