const express = require('express');
const router = express.Router();
const searchController = require('../src/controllers/search.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');

// Artisan search (by specialty, location, rating, etc.)
router.get('/artisans', authMiddleware, searchController.searchArtisans);

// Product search
router.get('/products', authMiddleware, searchController.searchProducts);

module.exports = router;
