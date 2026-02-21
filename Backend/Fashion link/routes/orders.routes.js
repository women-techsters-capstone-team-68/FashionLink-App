const express = require('express');
const router = express.Router();
const orderController = require('../src/controllers/orders.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');

// CRUD for Orders
router.post('/', authMiddleware, orderController.createOrder);
router.get('/', authMiddleware, orderController.getAllOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.patch('/:id', authMiddleware, orderController.updateOrder);
router.delete('/:id', authMiddleware, orderController.deleteOrder);

// Task assignment to an order
router.post('/:id/tasks', authMiddleware, orderController.assignTask);

module.exports = router;
