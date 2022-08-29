'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  subject.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    name: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    teacher: DataTypes.ARRAY(DataTypes.STRING),
    desciption: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'subject',
  });
  return subject;
};