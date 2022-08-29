'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      this.hasMany(models.murid, {as:'murid',foreignKey:'id'})
      this.hasMany(models.dosen, {as:'dosen',foreignKey:'id'})
    }
  }
  user.init({
    id: { type: DataTypes.STRING, primaryKey:true },
    nama: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};