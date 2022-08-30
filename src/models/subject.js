'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  Subject.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    name: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    teacher: DataTypes.ARRAY(DataTypes.STRING),
    description: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'subjects',
  });
  return Subject;
};