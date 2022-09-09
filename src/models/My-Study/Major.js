'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    static associate(models) {
      // define association here
    }
  }

  Major.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()')
    },
    name: DataTypes.STRING,
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
    modelName: 'Major',
    tableName: 'Majors',
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Major;
};