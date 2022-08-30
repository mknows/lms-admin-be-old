'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
    }
  }
  Comment.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    df_id: DataTypes.STRING,
    reply_to: DataTypes.STRING,
    penulis_id: DataTypes.STRING,
    content: DataTypes.STRING,
    teacher_like: DataTypes.ARRAY(DataTypes.STRING),
    student_like: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'comments',
  });
  return Comment;
};