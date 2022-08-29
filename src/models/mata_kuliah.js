'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mata_kuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mata_kuliah.init({
    id: { type: DataTypes.STRING, primaryKey:true },
    nama: DataTypes.STRING,
    durasi: DataTypes.NUMBER,
    dosen: DataTypes.ARRAY(DataTypes.STRING),
    deskripsi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'mata_kuliah',
  });
  return mata_kuliah;
};