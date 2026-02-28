const express = require('express');
const router = express.Router();
const orderController = require('../src/controllers/orders.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');
const roleMiddleware = require('../src/middlewares/role.middleware');

// CRUD for Orders (artisan, client, admin — controller filters by role)
const authRoles = [authMiddleware, roleMiddleware(['artisan', 'client', 'admin'])];
router.post('/', authRoles, orderController.createOrder);
router.get('/', authRoles, orderController.getAllOrders);
router.get('/:id', authRoles, orderController.getOrderById);
router.patch('/:id', authRoles, orderController.updateOrder);
router.delete('/:id', authRoles, orderController.deleteOrder);
router.post('/:id/tasks', authRoles, orderController.assignTask);

module.exports = router;
