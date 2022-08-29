'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  teacher.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    name: DataTypes.STRING,
    is_lecturer: DataTypes.BOOLEAN,
    is_mentor: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'teacher',
  });
  return teacher;
};