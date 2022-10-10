'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal("gen_random_uuid()"),
    },
    title: DataTypes.STRING,
    notification: DataTypes.STRING,
    is_read: DataTypes.BOOLEAN,
    user_id: DataTypes.UUID,
    type: DataTypes.STRING,
    sender_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'notifications',
  });
  return Notification;
};