'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class modul_murid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  modul_murid.init({
    modul_id: { type: DataTypes.STRING, primaryKey:true },
    murid_id: { type: DataTypes.STRING, primaryKey:true },
    waktu_pengambilan: DataTypes.DATE,
    nilai: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'modul_murid',
  });
  return modul_murid;
};