module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    'Client',
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      designerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'If set, this client is a registered user; used for "my orders"'
      }
    },
    {
      tableName: 'Clients',
      timestamps: true
    }
  );

  Client.associate = function (models) {
    Client.belongsTo(models.User, { foreignKey: 'designerId', as: 'designer' });
    Client.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Client.hasMany(models.Measurement, { foreignKey: 'ClientId', as: 'measurements' });
    Client.hasMany(models.Order, { foreignKey: 'ClientId', as: 'orders' });
  };

  return Client;
};
