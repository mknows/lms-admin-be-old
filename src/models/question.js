'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  question.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    questions: DataTypes.STRING,
    choice: DataTypes.STRING,
    answer: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'question',
  });
  return question;
};