const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authRoutes = require('../routes/auth.routes');
const clientRoutes = require('../routes/clients.routes');
const orderRoutes = require('../routes/orders.routes');
const artisanRoutes = require('../routes/artisan.routes');
const dashboardRoutes = require('../routes/dashboard.routes');
const userRoutes = require('../routes/users.routes');
const productRoutes = require('../routes/products.routes');
const searchRoutes = require('../routes/search.routes');
const aiRoutes = require('../routes/ai.routes');

const app = express();

// CORS: allow all origins for now (restrict in production)
app.use(cors());

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);
app.get('/', (_, res) => {
  res.json({ message: 'FashionLink API running 🚀' });
});

module.exports = app;

