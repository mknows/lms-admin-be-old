"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class dbArticle extends Model {
    static associate(models) {
      // dbArticle.belongsToMany(models.dbUser, { through: models.dbArticleUser });
    }
  }
  dbArticle.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
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
      tableName: "db_articles",
    }
  );
  return dbArticle;
};
