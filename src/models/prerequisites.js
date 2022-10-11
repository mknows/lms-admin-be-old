'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prerequisites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Prerequisites.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal("gen_random_uuid()"),
    },
    subject_id: DataTypes.UUID,
    prerequisite_subject_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'prerequisites',
  });
  return Prerequisites;
};