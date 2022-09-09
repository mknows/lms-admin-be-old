'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsToMany(models.Student, {
      //   through: models.StudentSubject,
      //   foreignKey: 'subject_id'
      // });
    }
  }

  Subject.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()')
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    number_of_sessions: DataTypes.INTEGER,
    level: DataTypes.STRING,
    degree: DataTypes.STRING,
    lecturer_id: DataTypes.ARRAY(DataTypes.UUID),
    created_by: {
      allowNull: false,
      type: DataTypes.STRING
    },
    created_by: {
      allowNull: false,
      type: DataTypes.STRING
    },
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
    modelName: 'Subject',
    tableName: 'Subjects',
    timestamps: true,
    underscored: true,
    underscoredAll: true
  });

  return Subject;
};