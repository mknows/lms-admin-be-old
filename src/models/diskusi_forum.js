'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Diskusi_forum extends Model {
    static associate(models) {
      this.belongsTo(models.pertemuan,{as:'pertemuan',foreignKey:'pertemuan_id'})
    }
  }
  Diskusi_forum.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    penulis_id: DataTypes.STRING,
    pertemuan_id: DataTypes.STRING,
    judul: DataTypes.STRING,
    konten: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'diskusi_forum',
  });
  return Diskusi_forum;
};