'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tugas_murid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tugas_murid.init({
    tugas_id: { type: DataTypes.STRING, primaryKey:true },
    murid_id: { type: DataTypes.STRING, primaryKey:true },
    waktu_pengambilan: DataTypes.DATE,
    waktu_pengumpulan: DataTypes.DATE,
    nilai: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'tugas_murid',
  });
  return tugas_murid;
};