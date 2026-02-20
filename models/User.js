'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('DESIGNER', 'ARTISAN', 'ADMIN'),
      defaultValue: 'DESIGNER'
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Client, { foreignKey: 'designerId' });
    User.hasOne(models.ArtisanProfile);
  };

  return User;
};
