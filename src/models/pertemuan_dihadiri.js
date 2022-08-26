'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pertemuan_dihadiri extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pertemuan_dihadiri.init({
    pertemuan_id: { type: DataTypes.STRING, primaryKey: true },
    murid_id: DataTypes.STRING,
    tgl_hadir: DataTypes.DATE,
    nilai_akhir: DataTypes.INTEGER,
    hadir: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'pertemuan_dihadiri',
  });
  return Pertemuan_dihadiri;
};