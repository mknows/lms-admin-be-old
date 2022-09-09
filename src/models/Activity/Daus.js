'use strict';
const { Model } = require('sequelize');

/**
 * @desc      Daily Activity Users (DAUs)
 * @route     -
 * @access    Private
 */
module.exports = (sequelize, DataTypes) => {
  class Daus extends Model {
    static associate(models) {
      // define association here
    }
  }

  Daus.init({
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
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'Daus',
    tableName: 'Daily_Active_Users',
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Daus;
};
