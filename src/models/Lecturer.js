"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lecturer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lecturer.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize.literal("gen_random_uuid()"),
      },
      user_id: DataTypes.STRING,
      is_lecturer: DataTypes.BOOLEAN,
      is_mentor: DataTypes.BOOLEAN,
      approvedBy: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "lecturers",
    }
  );
  return Lecturer;
};
