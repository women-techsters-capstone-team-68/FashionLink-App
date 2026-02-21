const express = require('express');
const router = express.Router();
const productController = require('../src/controllers/products.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');

// CRUD for Products
router.post('/', authMiddleware, productController.createProduct);
router.get('/', authMiddleware, productController.getAllProducts);
router.get('/:id', authMiddleware, productController.getProductById);
router.patch('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
