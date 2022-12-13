"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Meeting extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Meeting.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			meeting_type: DataTypes.STRING,
			time: DataTypes.DATE,
			place: DataTypes.STRING,
			topic: DataTypes.STRING,
			description: DataTypes.STRING,
			user_id: DataTypes.UUID,
			assessor_id: DataTypes.UUID,
			status: DataTypes.BOOLEAN,
			score: DataTypes.FLOAT,
			score_description: DataTypes.STRING,
		},
		{
			sequelize,
			tableName: "Meetings",
		}
	);
	return Meeting;
};
