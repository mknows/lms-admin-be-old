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
			time: {
				type: DataTypes.ARRAY(DataTypes.DATE),
				defaultValue: [],
			},
			time: DataTypes.DATE,
			place: DataTypes.STRING,
			subject: DataTypes.STRING,
			topic: DataTypes.STRING,
			description: DataTypes.STRING,
			student_id: DataTypes.UUID,
			assessor_id: DataTypes.UUID,
			status: DataTypes.BOOLEAN,
			pick_time: DataTypes.DATE,
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
