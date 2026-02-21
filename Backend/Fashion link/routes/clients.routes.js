const express = require('express');
const router = express.Router();
const clientController = require('../src/controllers/clients.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');

// CRUD for Clients
router.post('/', authMiddleware, clientController.createClient);
router.get('/', authMiddleware, clientController.getAllClients);
router.get('/:id', authMiddleware, clientController.getClientById);
router.patch('/:id', authMiddleware, clientController.updateClient);
router.delete('/:id', authMiddleware, clientController.deleteClient);

// Add measurement to a client
router.post('/:id/measurements', authMiddleware, clientController.addMeasurement);

module.exports = router;
