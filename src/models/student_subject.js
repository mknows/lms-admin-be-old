'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class student_subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  student_subject.init({
    subject_id: {type:DataTypes.STRING,primaryKey:true},
    student_id: DataTypes.STRING,
    date_taken: DataTypes.DATE,
    status: DataTypes.STRING,
    final_score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'student_subject',
  });
  return student_subject;
};