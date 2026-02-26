const express = require('express');
const morgan = require('morgan');

const authRoutes = require('../routes/auth.routes');
const clientRoutes = require('../routes/clients.routes');
const orderRoutes = require('../routes/orders.routes');
const artisanRoutes = require('../routes/artisan.routes');
const userRoutes = require('../routes/users.routes');
const productRoutes = require('../routes/products.routes');
const searchRoutes = require('../routes/search.routes');


const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);
app.get('/', (_, res) => {
  res.json({ message: 'FashionLink API running 🚀' });
});

module.exports = app;

