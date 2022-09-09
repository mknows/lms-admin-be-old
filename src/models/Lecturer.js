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
};
