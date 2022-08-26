'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Modul_diambil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Modul_diambil.init({
    modul_id: { type: DataTypes.STRING, primaryKey: true },
    murid_id: DataTypes.STRING,
    waktu_pengambilan: DataTypes.DATE,
    nilai: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'modul_diambil',
  });
  return Modul_diambil;
};