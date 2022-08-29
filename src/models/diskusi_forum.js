'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class diskusi_forum extends Model {
    static associate(models) {
      this.belongsTo(models.pertemuan, {as: 'pertemuan',foreignKey:'pertemuan_id'})
      this.belongsTo(models.murid, {as:'murid',foreignKey:'murid_id'})
    }
  }
  diskusi_forum.init({
    id: { type: DataTypes.STRING, primaryKey:true },
    penulis_id: DataTypes.STRING,
    pertemuan_id: DataTypes.STRING, 
    judul: DataTypes.STRING,
    konten: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'diskusi_forum',
  });
  return diskusi_forum;
};