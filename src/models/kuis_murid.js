'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kuis_murid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  kuis_murid.init({
    id: { type: DataTypes.STRING, primaryKey:true },
    murid_id: { type: DataTypes.STRING, primaryKey:true },
    waktu_pengambilan: DataTypes.DATE,
    waktu_pengumpulan: DataTypes.DATE,
    nilai: DataTypes.INTEGER,
    jawaban: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'kuis_murid',
  });
  return kuis_murid;
};