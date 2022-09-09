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
      this.hasMany(models.Administration, {
        foreignKey: 'id'
      })
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()')
    },
    firebase_uid: DataTypes.STRING,
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.CHAR(1),
    phone: DataTypes.STRING,
    display_picture: DataTypes.STRING,
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
    modelName: "User",
    tableName: "Users",
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return User;
};
