"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Reply.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize.literal("gen_random_uuid()"),
      },
      df_id: DataTypes.UUID,
      comment_id: DataTypes.UUID,
      author_id: DataTypes.UUID,
      content: DataTypes.STRING,
      teacher_like: DataTypes.ARRAY(DataTypes.UUID),
      student_like: DataTypes.ARRAY(DataTypes.UUID),
    },
    {
      sequelize,
      tableName: "replies",
    }
  );

  return Reply;
};
