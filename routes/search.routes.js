const express = require('express');
const routere = express.Router();
const searchController = require('../src/controllers/search.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');

// Artisan search (by specialty, location, rating, etc.)
routere.get('/artisans', authMiddleware, searchController.searchArtisans);

// Product search
routere.get('/products', authMiddleware, searchController.searchProducts);

module.exports = routere;
