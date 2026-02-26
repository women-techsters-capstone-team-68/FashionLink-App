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
// 🔹 Sync database
sequelize.sync({ alter: true }) // <-- this updates the DB with new columns
  .then(() => {
    console.log("Database synced successfully");

    // Start the server AFTER DB is synced
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });
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
