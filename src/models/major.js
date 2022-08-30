'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Major.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    name: DataTypes.STRING,
    subjects: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    tableName: 'majors',
  });
  return Major;
};