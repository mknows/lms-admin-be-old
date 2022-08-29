'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class student_major extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  student_major.init({
    major_id: {type:DataTypes.STRING,primaryKey:true},
    student_id: {type:DataTypes.STRING,primaryKey:true},
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'student_major',
  });
  return student_major;
};