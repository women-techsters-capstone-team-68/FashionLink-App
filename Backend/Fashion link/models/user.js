module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['artisan', 'client', 'admin']]
      }
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = function (models) {
    User.hasMany(models.Product, { foreignKey: 'userId', as: 'products' });
    User.hasMany(models.Client, { foreignKey: 'designerId', as: 'clients' });
    User.hasOne(models.ArtisanProfile, { foreignKey: 'UserId', as: 'artisanProfile' });
    User.hasMany(models.Order, { foreignKey: 'UserId', as: 'orders' });
  };

  return User;
};