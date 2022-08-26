'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pertanyaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pertanyaan.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    pertanyaan: DataTypes.STRING,
    pilihan: DataTypes.STRING,
    jawaban: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pertanyaan',
  });
  return Pertanyaan;
};