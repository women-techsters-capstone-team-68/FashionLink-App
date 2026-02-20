'use strict';

module.exports = (sequelize, DataTypes) => {
  const Measurement = sequelize.define('Measurement', {
    chest: DataTypes.FLOAT,
    waist: DataTypes.FLOAT,
    hips: DataTypes.FLOAT,
    shoulder: DataTypes.FLOAT,
    inseam: DataTypes.FLOAT
  });

  Measurement.associate = (models) => {
    Measurement.belongsTo(models.Client);
  };

  return Measurement;
};
