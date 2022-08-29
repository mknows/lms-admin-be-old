'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class student_quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  student_quiz.init({
    quiz_id: {type:DataTypes.STRING,primaryKey:true},
    murid_id: {type:DataTypes.STRING,primaryKey:true},
    time_taken: DataTypes.DATE,
    time_submitted: DataTypes.DATE,
    score: DataTypes.INTEGER,
    answer: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'student_quiz',
  });
  return student_quiz;
};