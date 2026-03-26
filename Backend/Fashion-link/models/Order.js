module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      UserId: DataTypes.INTEGER,
      ClientId: DataTypes.INTEGER,
      order_number: DataTypes.STRING,
      total_amount: DataTypes.DECIMAL(10, 2),
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
      },
      shipping_address: DataTypes.TEXT,
      notes: DataTypes.TEXT,
      delivery_date: { type: DataTypes.DATEONLY, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      styleReferenceImageUrl: { type: DataTypes.STRING, allowNull: true },
      chest: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
      waist: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
      hip: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
      shoulder: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
      sleeve: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
      length: { type: DataTypes.DECIMAL(6, 2), allowNull: true }
    },
    {
      tableName: 'Orders',
      timestamps: true
    }
  );

  Order.associate = function (models) {
    Order.belongsTo(models.User, { foreignKey: 'UserId', as: 'artisan' });
    Order.belongsTo(models.Client, { foreignKey: 'ClientId', as: 'client' });
    Order.hasMany(models.Task, { foreignKey: 'OrderId', as: 'tasks' });
  };

  return Order;
};
