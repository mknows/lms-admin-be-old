'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class module_video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  module_video.init({
    module_id: {type:DataTypes.STRING,primaryKey:true},
    video_id: {type:DataTypes.STRING,primaryKey:true}
  }, {
    sequelize,
    modelName: 'module_video',
  });
  return module_video;
};