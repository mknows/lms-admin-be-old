'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    static associate(models) {
      // define association here
    }
  }

  Quiz.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    session_id: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    questions: DataTypes.JSON,
    answer: DataTypes.ARRAY(DataTypes.STRING),
    description: DataTypes.STRING,
    user_id: DataTypes.STRING,
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Quiz',
    tableName: 'Quizzes',
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Quiz;
};