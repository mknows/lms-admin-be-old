'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class student_session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  student_session.init({
    session_id: {type:DataTypes.STRING,primaryKey:true},
    student_id: {type:DataTypes.STRING,primaryKey:true},
    date_present: DataTypes.DATE,
    final_score: DataTypes.NUMBER,
    present: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'student_session',
  });
  return student_session;
};