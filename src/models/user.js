"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {}
	}
	User.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			firebase_uid: DataTypes.STRING,
			full_name: DataTypes.STRING,
			email: DataTypes.STRING,
			gender: DataTypes.STRING,
			phone: DataTypes.STRING,
			image: DataTypes.STRING,
			address: DataTypes.STRING,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "users",
			timestamps: true,
			underscored: true,
			underscoredAll: true,
		}
	);
	return User;
=======
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Administration, {
        foreignKey: 'id'
      })
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()')
    },
    firebase_uid: DataTypes.STRING,
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.CHAR(1),
    phone: DataTypes.STRING,
    display_picture: DataTypes.STRING,
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return User;
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d
};
