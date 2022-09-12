"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Material_Enrolled extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Material_Enrolled.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize.literal("gen_random_uuid()"),
      },
      student_id: DataTypes.UUID,
      session_id: DataTypes.UUID,
      subject_id: DataTypes.UUID,
      material_id: { type: DataTypes.UUID, primaryKey: true },
      status: DataTypes.STRING,
      id_referrer: DataTypes.STRING,
      type: DataTypes.STRING,
      score: DataTypes.INTEGER,
      activity_detail: DataTypes.JSON,
    },
    {
      sequelize,
      tableName: "material_enrolleds",
    }
  );
  return Material_Enrolled;
};
