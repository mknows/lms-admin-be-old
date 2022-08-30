'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ModuleVideo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ModuleVideo.init({
    module_id: {type:DataTypes.STRING,primaryKey:true},
    video_id: {type:DataTypes.STRING,primaryKey:true}
  }, {
    sequelize,
    tableName: 'module_videos',
  });
  return ModuleVideo;
};