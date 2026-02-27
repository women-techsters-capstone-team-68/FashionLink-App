const express = require('express');
const router = express.Router();
const productController = require('../src/controllers/products.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');
const roleMiddleware = require('../src/middlewares/role.middleware');

// CRUD for Products (artisan or admin)
const artisanOnly = [authMiddleware, roleMiddleware(['artisan', 'admin'])];
router.post('/', artisanOnly, productController.createProduct);
router.get('/', artisanOnly, productController.getAllProducts);
router.get('/:id', artisanOnly, productController.getProductById);
router.patch('/:id', artisanOnly, productController.updateProduct);
router.delete('/:id', artisanOnly, productController.deleteProduct);

module.exports = router;
