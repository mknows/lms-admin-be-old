'use strict';
const {
  Model
} = require('sequelize');
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
  Material_Enrolled.init({
    student_id: DataTypes.STRING,
    session_id: DataTypes.STRING,
    student_id: DataTypes.STRING,
    material_id: DataTypes.STRING,
    description: DataTypes.STRING,
    id_referrer: DataTypes.STRING,
    type: DataTypes.STRING,
    answer: DataTypes.ARRAY,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'material_enrolled',
  });
  return Material_Enrolled;
};