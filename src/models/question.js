'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Question.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    questions: DataTypes.STRING,
    choice: DataTypes.STRING,
    answer: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'questions',
  });
  return Question;
};