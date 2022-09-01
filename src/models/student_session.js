'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentSession.init({
    session_id: {type:DataTypes.UUID,primaryKey:true},
    student_id: {type:DataTypes.UUID,primaryKey:true},
    date_present: DataTypes.DATE,
    final_score: DataTypes.INTEGER,
    present: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'student_sessions',
  });
  return StudentSession;
};