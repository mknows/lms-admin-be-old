'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ModuleDocument extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ModuleDocument.init({
    module_id: {type:DataTypes.STRING,primaryKey:true},
    document_id:{type:DataTypes.STRING,primaryKey:true}
  }, {
    sequelize,
    tableName: 'module_documents',
  });
  return ModuleDocument;
};