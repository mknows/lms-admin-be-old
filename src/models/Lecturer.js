'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lecturer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lecturer.init({
    id: {type:DataTypes.UUID,primaryKey:true},
    firebaseUID: DataTypes.STRING,
    name: DataTypes.STRING,
    is_lecturer: DataTypes.BOOLEAN,
    is_mentor: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'lecturers',
  });
  return Lecturer;
};