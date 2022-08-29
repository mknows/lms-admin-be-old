'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pertanyaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pertanyaan.init({
    id: { type: DataTypes.STRING, primaryKey:true },
    pertanyaan: DataTypes.STRING,
    pilihan: DataTypes.STRING,
    jawaban: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pertanyaan',
  });
  return pertanyaan;
};