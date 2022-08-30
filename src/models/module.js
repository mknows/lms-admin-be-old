'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Module.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    session_id: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    video_id: DataTypes.STRING,
    dokumen_id: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'modules',
  });
  return Module;
};