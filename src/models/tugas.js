'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tugas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tugas.init({
    id: { type: DataTypes.STRING, primaryKey:true },
    pertemuan_id: DataTypes.STRING,
    durasi: DataTypes.NUMBER,
    deskripsi: DataTypes.STRING,
    konten: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tugas',
  });
  return tugas;
};