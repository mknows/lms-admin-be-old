'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subject_Major extends Model {
    static associate(models) {
      // define association here
    }
  }

  Subject_Major.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()')
    },
    major_id: DataTypes.UUID,
    subject_id: DataTypes.UUID,
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
    modelName: 'Subject_Major',
    tableName: 'Subjects_Majors',
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Subject_Major;
};