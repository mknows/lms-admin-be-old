"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Student extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsToMany(models.Subject, {
				through: models.StudentSubject,
				foreignKey: "student_id",
			});
			this.belongsToMany(models.Major, {
				through: models.StudentMajor,
				foreignKey: "student_id",
			});
			this.belongsTo(models.User, {
				foreignKey: "user_id",
			});
			this.belongsToMany(models.Session, {
				through: models.StudentSession,
				foreignKey: "student_id",
			});
			this.belongsTo(models.Lecturer, {
				foreignKey: 'supervisor_id'
			});
		}
	}

	Student.init(
		{
			id: {
				type: DataTypes.UUID,		
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			user_id: DataTypes.UUID,
			supervisor_id: DataTypes.UUID,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "students",
		}
	);

	return Student;
};
