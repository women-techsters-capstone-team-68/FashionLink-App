const express = require('express');
const routere = express.Router();
const searchController = require('../src/controllers/search.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');
const roleMiddleware = require('../src/middlewares/role.middleware');

// Search (artisan, client, admin for browsing)
const searchRoles = [authMiddleware, roleMiddleware(['artisan', 'client', 'admin'])];
routere.get('/artisans', searchRoles, searchController.searchArtisans);
routere.get('/products', searchRoles, searchController.searchProducts);

module.exports = routere;
