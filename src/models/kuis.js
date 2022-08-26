'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kuis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Kuis.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    pertemuan_id: DataTypes.STRING,
    durasi: DataTypes.STRING,
    pertanyaan_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'kuis',
  });
  return Kuis;
};