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
    id: {
      type:DataTypes.UUID,
      primaryKey:true,
      defaultValue:sequelize.literal('gen_random_uuid()')
    },
    user_id: DataTypes.UUID,
    major_id: DataTypes.ARRAY(DataTypes.STRING),
    approved_By: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'students',
  });

  return Student;
};