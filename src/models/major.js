'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Major.init({
    id: {
      type:DataTypes.UUID,
      primaryKey:true,
      defaultValue:sequelize.literal('gen_random_uuid()')
    },
    name: DataTypes.STRING,
    subjects: DataTypes.ARRAY(DataTypes.UUID)
  }, {
    sequelize,
    tableName: 'majors',
  });
  return Major;
};