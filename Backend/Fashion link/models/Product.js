module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      productName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      brand: DataTypes.STRING,
      category: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      colour: DataTypes.STRING,
      size: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'products',   // ✅ OPTIONS GO HERE
      timestamps: true         // ✅ OPTIONS GO HERE
    }
  );

  Product.associate = function (models) {
    Product.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Product;
};
