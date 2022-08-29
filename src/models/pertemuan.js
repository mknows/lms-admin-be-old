'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pertemuan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pertemuan.init({
    id: { type: DataTypes.STRING, primaryKey:true },
    mk_id: DataTypes.STRING,
    pertemuan_ke: DataTypes.INTEGER,
    durasi: DataTypes.INTEGER,
    is_sinkronus: DataTypes.BOOLEAN,
    tipe: DataTypes.STRING,
    deskripsi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pertemuan',
  });
  return pertemuan;
};