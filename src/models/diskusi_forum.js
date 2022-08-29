'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class diskusi_forum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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