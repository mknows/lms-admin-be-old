'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mk_diambil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mk_diambil.init({
    mk_id: { type: DataTypes.STRING, primaryKey: true },
    murid_id: DataTypes.STRING,
    tgl_diambil: DataTypes.DATE,
    status: DataTypes.STRING,
    nilai_akhir: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'mk_diambil',
  });
  return Mk_diambil;
};