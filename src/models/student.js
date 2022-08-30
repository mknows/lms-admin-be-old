'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Subject, { 
        through: models.StudentSubject,
        foreignKey: 'student_id',
        otherKey: 'subject_id'
      });
    }
  }

  Student.init({
    firebaseUID: {type:DataTypes.STRING,primaryKey:true},
    fullName: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'students',
  });

  return Student;
};