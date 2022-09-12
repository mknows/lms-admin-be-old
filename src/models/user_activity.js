"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Activity.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize.literal("gen_random_uuid()"),
      },
      activity: DataTypes.STRING,
      ip_address: DataTypes.STRING,
      referrer: DataTypes.STRING,
      device: DataTypes.STRING,
      platform: DataTypes.STRING,
      operating_system: DataTypes.STRING,
      source: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "user_activities",
    }
  );
  return User_Activity;
};
