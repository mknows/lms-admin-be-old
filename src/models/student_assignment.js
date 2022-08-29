'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class student_assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  student_assignment.init({
    tugas_id: {type:DataTypes.STRING,primaryKey:true},
    murid_id: DataTypes.STRING,
    date_taken: DataTypes.DATE,
    date_submitted: DataTypes.DATE,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'student_assignment',
  });
  return student_assignment;
};