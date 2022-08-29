'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class major extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  major.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    name: DataTypes.STRING,
    subjects: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'major',
  });
  return major;
};