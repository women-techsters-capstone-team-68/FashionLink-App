const express = require('express');
const router = express.Router();
const artisanController = require('../src/controllers/artisans.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');

// CRUD for Artisan Profiles
router.post('/', authMiddleware, artisanController.createArtisanProfile);
router.get('/', authMiddleware, artisanController.getAllArtisans);
router.get('/:id', authMiddleware, artisanController.getArtisanById);
router.patch('/:id', authMiddleware, artisanController.updateArtisanProfile);
router.delete('/:id', authMiddleware, artisanController.deleteArtisanProfile);

module.exports = router;
