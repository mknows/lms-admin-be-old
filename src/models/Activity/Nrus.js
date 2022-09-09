'use strict';
const { Model } = require('sequelize');

/**
 * @desc      New Register Users (NRUs)
 * @route     -
 * @access    Private
 */
module.exports = (sequelize, DataTypes) => {
  class Nrus extends Model {
    static associate(models) {
      // define association here
    }
  }

  Nrus.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()')
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID
    },
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
    modelName: 'Nrus',
    tableName: 'New_Register_Users',
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Nrus;
};
