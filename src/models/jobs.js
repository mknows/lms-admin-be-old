"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Job extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Company, {
				foreignKey: "company_id",
			});
		}
	}
	Job.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			company_id: DataTypes.UUID,
			description: DataTypes.TEXT,
			salary: DataTypes.INTEGER,
			deadline: DataTypes.DATE,
			type: DataTypes.STRING,
			position: DataTypes.STRING,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "jobs",
		}
	);
	return Job;
};
