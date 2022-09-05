'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentSubject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentSubject.init({
    id:{
      type:DataTypes.UUID,
      primaryKey:true,
      defaultValue:sequelize.literal('gen_random_uuid()')
    },
    subject_id: DataTypes.UUID,
    student_id: DataTypes.UUID,
    date_taken: DataTypes.DATE,
    date_finished: DataTypes.DATE,
    status: DataTypes.STRING,
    final_score: DataTypes.FLOAT
  }, {
    sequelize,
    tableName: 'student_subjects',
  });
  return StudentSubject;
};