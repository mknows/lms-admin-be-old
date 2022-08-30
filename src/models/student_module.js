'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentModule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentModule.init({
    module_id: {type:DataTypes.STRING,primaryKey:true},
    student_id: {type:DataTypes.STRING,primaryKey:true},
    time_taken: DataTypes.DATE,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'student_modules',
  });
  return StudentModule;
};