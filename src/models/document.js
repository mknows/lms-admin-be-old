'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Document.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    subject_id : DataTypes.STRING,
    session_id : DataTypes.STRING,
    content: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'documents',
  });
  return Document;
};