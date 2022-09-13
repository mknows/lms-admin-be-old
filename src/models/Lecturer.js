<<<<<<< HEAD
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Lecturer extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Lecturer.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			user_id: DataTypes.STRING,
			is_lecturer: DataTypes.BOOLEAN,
			is_mentor: DataTypes.BOOLEAN,
			approvedBy: DataTypes.UUID,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "lecturers",
			timestamps: true,
			underscored: true,
			underscoredAll: true,
		}
	);
	return Lecturer;
=======
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lecturer extends Model {
    static associate(models) {
      // define association here
    }
  }

  Lecturer.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()')
    },
    user_id: DataTypes.UUID,
    is_lecturer: DataTypes.BOOLEAN,
    is_mentor: DataTypes.BOOLEAN,
    approved_by: DataTypes.UUID,
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Lecturer',
    tableName: 'Lecturers',
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Lecturer;
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d
};
