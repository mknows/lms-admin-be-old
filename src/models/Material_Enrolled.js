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
    subject_id: DataTypes.STRING,
    material_id: {type:DataTypes.STRING,primaryKey:true},
    description: DataTypes.STRING,
    id_referrer: DataTypes.STRING,
    type: DataTypes.STRING,
    answer: DataTypes.ARRAY,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'material_enrolleds',
  });
  return Material_Enrolled;
};