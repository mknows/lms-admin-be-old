"use strict";
const { Model } = require("sequelize");
const dbArticle = require("./dbArticle");
const dbUser = require("./dbUser");
module.exports = (sequelize, DataTypes) => {
  class dbArticleUser extends Model {
    static associate(models) {
    }
  }
  dbArticleUser.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,

      },
      article_id: {
        type: DataTypes.INTEGER,

      },
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
      tableName: "db_articles_users",
    }
  );
  return dbArticleUser;
};
