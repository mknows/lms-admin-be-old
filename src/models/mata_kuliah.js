'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mata_kuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mata_kuliah.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    nama: DataTypes.STRING,
    durasi: DataTypes.INTEGER,
    dosen: DataTypes.ARRAY(DataTypes.STRING),
    deskripsi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'mata_kuliah',
  });
  return Mata_kuliah;
};