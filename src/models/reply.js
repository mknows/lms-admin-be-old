'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reply.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    df_id: DataTypes.STRING,
    reply_ke: DataTypes.STRING,
    penulis_id: DataTypes.STRING,
    konten: DataTypes.STRING,
    dosen_like: DataTypes.ARRAY(DataTypes.STRING),
    murid_like: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'reply',
  });
  return Reply;
};