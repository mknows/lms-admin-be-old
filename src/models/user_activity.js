"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_activity.init(
    {
      ip_address: DataTypes.STRING,
      referrer: DataTypes.STRING,
      device: DataTypes.STRING,
      platform: DataTypes.STRING,
      user_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User_Activity",
      tableName: "User_Activity",
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    }
  );
  return User_activity;
};
