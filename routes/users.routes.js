const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/users.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');

// Get all users (admin only)
router.get('/', authMiddleware, userController.getAllUsers);

// Get a single user
router.get('/:id', authMiddleware, userController.getUserById);

// Update a user
router.patch('/:id', authMiddleware, userController.updateUser);

// Delete a user
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;
