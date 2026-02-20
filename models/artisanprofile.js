const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ArtisanProfile', {
    specialties: DataTypes.JSON,
    location: DataTypes.STRING,
    rating: DataTypes.FLOAT
  });
};
