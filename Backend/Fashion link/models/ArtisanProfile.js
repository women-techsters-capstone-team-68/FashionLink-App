module.exports = (sequelize, DataTypes) => {
  const ArtisanProfile = sequelize.define(
    'ArtisanProfile',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      name: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: true },
      location: { type: DataTypes.STRING, allowNull: true },
      rating: { type: DataTypes.DECIMAL(3, 2), allowNull: true, defaultValue: 0 },
      experience: { type: DataTypes.INTEGER, allowNull: true, comment: 'Years of experience' },
      experienceLevel: { type: DataTypes.STRING, allowNull: true },
      category: { type: DataTypes.STRING, allowNull: true },
      collabTypes: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      skills: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      bio: { type: DataTypes.TEXT, allowNull: true },
      avatarUrl: { type: DataTypes.STRING, allowNull: true },
      portfolio: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of { img, caption }'
      }
    },
    {
      tableName: 'ArtisanProfiles',
      timestamps: true
    }
  );

  ArtisanProfile.associate = function (models) {
    ArtisanProfile.belongsTo(models.User, { foreignKey: 'UserId', as: 'user' });
  };

  return ArtisanProfile;
};
