const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./users.routes');
const productRoutes = require('./products.routes');
const clientRoutes = require('./clients.routes');
const orderRoutes = require('./orders.routes');
const artisanRoutes = require('./artisans.routes');
const searchRoutes = require('./search.routes');

// Mount each route module
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/clients', clientRoutes);
router.use('/orders', orderRoutes);
router.use('/artisans', artisanRoutes);
router.use('/search', searchRoutes);

// Optional: default route for health check
router.get('/', (req, res) => {
  res.json({ message: 'API is running 🚀' });
});

module.exports = router;
