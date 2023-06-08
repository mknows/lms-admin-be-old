"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dbUser extends Model {
    static associate(models) {
      // dbUser.belongsToMany(models.dbArticle, { through: models.dbArticleUser });
    }
  }
  dbUser.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at",
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "updated_at",
      },
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "db_users",
    }
  );
  return dbUser;
};
