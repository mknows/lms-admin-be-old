'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentMajor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentMajor.init({
    major_id: {type:DataTypes.UUID,primaryKey:true},
    student_id: {type:DataTypes.UUID,primaryKey:true},
    status: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'student_majors',
  });
  return StudentMajor;
};