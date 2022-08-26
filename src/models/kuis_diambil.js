'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kuis_diambil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Kuis_diambil.init({
    id:{ type: DataTypes.STRING, primaryKey: true },
    murid_id: DataTypes.STRING,
    waktu_pengambilan: DataTypes.DATE,
    waktu_pengumpulan: DataTypes.DATE,
    nilai: DataTypes.INTEGER,
    jawaban: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'kuis_diambil',
  });
  return Kuis_diambil;
};