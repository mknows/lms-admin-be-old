'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class video_modul extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  video_modul.init({
    modul_id: { type: DataTypes.STRING, primaryKey:true },
    video_id: { type: DataTypes.STRING, primaryKey:true }
  }, {
    sequelize,
    modelName: 'video_modul',
  });
  return video_modul;
};