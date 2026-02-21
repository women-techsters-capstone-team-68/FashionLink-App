require('dotenv').config();
const { sequelize, Product } = require('./models');

const verifyProducts = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');

    // Fetch all products
    const products = await Product.findAll();
    
    if (products.length === 0) {
      console.log('❌ No products found in the database');
    } else {
      console.log(`✅ Found ${products.length} products:\n`);
      console.table(products.map(p => ({
        ID: p.id,
        Name: p.productName,
        Brand: p.brand,
        Category: p.category,
        Price: p.price,
        Colour: p.colour,
        Size: p.size
      })));
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verifyProducts();
