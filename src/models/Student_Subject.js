"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class StudentSubject extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Subject, {
				foreignKey: "subject_id",
			});
		}
	}
	StudentSubject.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			subject_id: DataTypes.UUID,
			student_id: DataTypes.UUID,
			date_taken: DataTypes.DATE,
			date_finished: DataTypes.DATE,
			status: DataTypes.STRING,
			proof: DataTypes.STRING,
			proof_link: DataTypes.STRING,
			final_score: DataTypes.FLOAT,
			semester: DataTypes.INTEGER,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "student_subjects",
		}
	);
	return StudentSubject;
};
