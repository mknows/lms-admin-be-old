"use strict";
const { Model } = require("sequelize");

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
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
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
    modelName: "Nrus",
    tableName: "New_Register_Users",
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Nrus;
};
