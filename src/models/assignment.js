'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  assignment.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    session_id: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    description: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'assignment',
  });
  return assignment;
};