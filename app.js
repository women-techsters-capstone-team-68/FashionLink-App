const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// ==========================
// Global Middlewares
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==========================
// Routes
// ==========================
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const productsRoutes = require('./routes/products.routes');
const clientsRoutes = require('./routes/clients.routes');
const ordersRoutes = require('./routes/orders.routes');
const artisansRoutes = require('./routes/artisans.routes');
const searchRoutes = require('./routes/search.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/artisans', artisansRoutes);
app.use('/api/search', searchRoutes);

// ==========================
// Health Check
// ==========================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'FashionLink API is running 🚀'
  });
});

// ==========================
// 404 Handler
// ==========================
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// ==========================
// Global Error Handler
// ==========================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
