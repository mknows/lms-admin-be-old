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
        foreignKey: 'student_id'
      });
    }
  }

  Student.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    firebaseUID: DataTypes.STRING,
    fullName: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'students',
  });

  return Student;
};