const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/users.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');
const roleMiddleware = require('../src/middlewares/role.middleware');

// Users: artisan, client, admin can access (e.g. own profile; admin can manage all)
const authRoles = [authMiddleware, roleMiddleware(['artisan', 'client', 'admin'])];
router.get('/', authRoles, userController.getAllUsers);
router.get('/:id', authRoles, userController.getUserById);
router.patch('/:id', authRoles, userController.updateUser);
router.delete('/:id', authRoles, userController.deleteUser);

module.exports = router;
