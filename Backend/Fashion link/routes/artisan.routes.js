const express = require('express');
const router = express.Router();
const artisanController = require('../src/controllers/artisans.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');
const roleMiddleware = require('../src/middlewares/role.middleware');

// Browse artisan network (artisan, client, admin)
const browseRoles = [authMiddleware, roleMiddleware(['artisan', 'client', 'admin'])];
router.get('/', browseRoles, artisanController.getAllArtisans);
router.get('/:id', browseRoles, artisanController.getArtisanById);

// Create/update/delete own profile (artisan or admin)
const artisanOnly = [authMiddleware, roleMiddleware(['artisan', 'admin'])];
router.post('/', artisanOnly, artisanController.createArtisanProfile);
router.patch('/:id', artisanOnly, artisanController.updateArtisanProfile);
router.delete('/:id', artisanOnly, artisanController.deleteArtisanProfile);

module.exports = router;
