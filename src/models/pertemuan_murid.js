'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pertemuan_murid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pertemuan_murid.init({
    pertemuan_id: { type: DataTypes.STRING, primaryKey:true },
    murid_id: { type: DataTypes.STRING, primaryKey:true },
    tgl_hadir: DataTypes.DATE,
    nilai_akhir: DataTypes.NUMBER,
    hadir: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'pertemuan_murid',
  });
  return pertemuan_murid;
};