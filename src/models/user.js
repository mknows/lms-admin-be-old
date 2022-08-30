"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  User.init({
    firebase_uid: DataTypes.STRING,
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.CHAR(1),
    role: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    is_lecturer: DataTypes.BOOLEAN,
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
    modelName: "User",
    tableName: "Users",
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return User;
};
