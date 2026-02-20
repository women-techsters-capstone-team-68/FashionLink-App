require('dotenv').config(); // Load environment variables

const app = require('./app');
const { sequelize } = require('../models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ==========================
    // Database Connection Check
    // ==========================
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Optional: sync models (use carefully in production)
    // await sequelize.sync({ alter: false });

    // ==========================
    // Start Server
    // ==========================
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1); // Stop the app if DB fails
  }
};

startServer();
