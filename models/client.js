'use strict';

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING
  });

  Client.associate = (models) => {
    Client.belongsTo(models.User, { foreignKey: 'designerId' });
    Client.hasOne(models.Measurement);
    Client.hasMany(models.Order);
  };

  return Client;
};
