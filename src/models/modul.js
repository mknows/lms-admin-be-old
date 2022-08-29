'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class modul extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  modul.init({
    id: { type: DataTypes.STRING, primaryKey:true },
    pertemuan_id: DataTypes.STRING,
    durasi: DataTypes.STRING,
    video_id: DataTypes.STRING,
    dokumen_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'modul',
  });
  return modul;
};