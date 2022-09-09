"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User_Activity extends Model {
    static associate(models) {
      // define association here
    }
  }

  User_Activity.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()')
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID
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
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: "User_Activity",
    tableName: "Users_Activities",
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  });

  return User_Activity;
};
