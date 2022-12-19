"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsToMany(models.Student, {
				through: models.StudentEvent,
				foreignKey: "event_id",
			});
		}
	}
	Event.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			name: DataTypes.STRING,
			registration_closed: DataTypes.DATE,
			date_start: DataTypes.DATE,
			date_end: DataTypes.DATE,
			description: DataTypes.TEXT,
			organizer: DataTypes.STRING,
			capacity: DataTypes.INTEGER,
			price: DataTypes.INTEGER,
			type: DataTypes.STRING,
			material: DataTypes.ARRAY(DataTypes.STRING),
			speaker_details: DataTypes.JSON,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "events",
		}
	);
	return Event;
};
