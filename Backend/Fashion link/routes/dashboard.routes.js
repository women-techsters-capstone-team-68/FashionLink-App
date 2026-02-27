const express = require('express');
const router = express.Router();
const dashboardController = require('../src/controllers/dashboard.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');
const roleMiddleware = require('../src/middlewares/role.middleware');

router.get(
  '/stats',
  authMiddleware,
  roleMiddleware(['artisan', 'admin']),
  dashboardController.getStats
);

module.exports = router;
