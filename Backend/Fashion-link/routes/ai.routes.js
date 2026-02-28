const express = require('express');
const router = express.Router();
const aiController = require('../src/controllers/ai.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');
const roleMiddleware = require('../src/middlewares/role.middleware');

const aiRoles = [authMiddleware, roleMiddleware(['artisan', 'client', 'admin'])];

router.post('/chat', aiRoles, aiController.chat);
router.post('/recommendations/artisans', aiRoles, aiController.getArtisanRecommendations);

module.exports = router;
