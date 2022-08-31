'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  User.init({
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement: true},
    firebaseUID: DataTypes.STRING,
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'users',
  });
  return User;
};