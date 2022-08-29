'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jurusan_murid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jurusan_murid.init({
    jurusan_id: { type: DataTypes.STRING, primaryKey:true },
    murid_id: { type: DataTypes.STRING, primaryKey:true },
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'jurusan_murid',
  });
  return jurusan_murid;
};