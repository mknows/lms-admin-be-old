'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dosen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  dosen.init({
    id: { type: DataTypes.STRING, primaryKey:true },
    nama: DataTypes.STRING,
    is_pengampu: DataTypes.BOOLEAN,
    is_pembimbing: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'dosen',
  });
  return dosen;
};