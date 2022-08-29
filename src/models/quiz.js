'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  quiz.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    session_id: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    question_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'quiz',
  });
  return quiz;
};