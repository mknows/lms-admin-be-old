"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Subject extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsToMany(models.Student, {
				through: models.StudentSubject,
				foreignKey: "subject_id",
			});
			this.belongsToMany(models.Major, {
				through: models.MajorSubject,
				foreignKey: "subject_id",
			});
		}
	}
	Subject.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			name: DataTypes.STRING,
			number_of_sessions: DataTypes.INTEGER,
			degree: DataTypes.STRING,
			level: DataTypes.STRING,
			lecturer: DataTypes.ARRAY(DataTypes.UUID),
			basic_competencies: DataTypes.STRING,
			indicator: DataTypes.STRING,
			study_experience : DataTypes.STRING,
			teaching_materials:DataTypes.STRING,
			tools_needed: DataTypes.STRING,
			scoring: DataTypes.STRING,
			description: DataTypes.STRING,
			credit: DataTypes.INTEGER,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "subjects",
		}
	);
	return Subject;
};
