"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Activity extends Model {
    static associate(models) {
      // define association here
    }
  }

  User_Activity.init(
    {
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
    },
    {
      sequelize,
      modelName: "User_Activity",
      tableName: "User_Activities",
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    }
  );

  return User_Activity;
};
