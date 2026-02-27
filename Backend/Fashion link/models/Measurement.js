module.exports = (sequelize, DataTypes) => {
  const Measurement = sequelize.define(
    'Measurement',
    {
      ClientId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      chest: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
      waist: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
      hip: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
      shoulder: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
      sleeve: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
      length: { type: DataTypes.DECIMAL(6, 2), allowNull: true }
    },
    {
      tableName: 'Measurements',
      timestamps: true
    }
  );

  Measurement.associate = function (models) {
    Measurement.belongsTo(models.Client, { foreignKey: 'ClientId', as: 'client' });
  };

  return Measurement;
};
