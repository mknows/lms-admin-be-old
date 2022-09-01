'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  Video.init({
    id: {
      type:DataTypes.UUID,
      primaryKey:true,
      defaultValue:sequelize.literal('gen_random_uuid()')
    },
    url: DataTypes.STRING,
    description: DataTypes.TEXT,
    updatedBy: {
      type:DataTypes.STRING
    },
    createdBy: {
      type:DataTypes.STRING
    },
  }, {
    sequelize,
    tableName: 'videos',
  });
  return Video;
};