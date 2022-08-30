"use strict";
const { Model } = require("sequelize");

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
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      field: "created_at"
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      field: "updated_at"
    }
  }, {
    sequelize,
    modelName: "Daus",
    tableName: "Daily_Active_Users",
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Daus;
};
