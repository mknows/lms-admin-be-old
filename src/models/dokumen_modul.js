'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dokumen_modul extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  dokumen_modul.init({
    modul_id: { type: DataTypes.STRING, primaryKey:true },
    dokumen_id: { type: DataTypes.STRING, primaryKey:true }
  }, {
    sequelize,
    modelName: 'dokumen_modul',
  });
  return dokumen_modul;
};