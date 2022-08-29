'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  session.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    subject_id: DataTypes.STRING,
    session_no: DataTypes.NUMBER,
    duration: DataTypes.INTEGER,
    is_sync: DataTypes.BOOLEAN,
    type: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'session',
  });
  return session;
};