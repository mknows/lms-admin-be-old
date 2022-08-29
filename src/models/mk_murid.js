'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mk_murid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mk_murid.init({
    mk_id: { type: DataTypes.STRING, primaryKey:true },
    murid_id: { type: DataTypes.STRING, primaryKey:true },
    tgl_diambil: DataTypes.DATE,
    status: DataTypes.STRING,
    nilai_akhir: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'mk_murid',
  });
  return mk_murid;
};