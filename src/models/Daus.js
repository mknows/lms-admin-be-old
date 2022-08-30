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
    activity: DataTypes.STRING,
    ip_address: DataTypes.STRING,
    referrer: DataTypes.STRING,
    device: DataTypes.STRING,
    platform: DataTypes.STRING,
    operating_system: DataTypes.STRING,
    source: DataTypes.STRING,
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
