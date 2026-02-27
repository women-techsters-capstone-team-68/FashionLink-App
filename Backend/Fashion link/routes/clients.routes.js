const express = require('express');
const router = express.Router();
const clientController = require('../src/controllers/clients.controller');
const authMiddleware = require('../src/middlewares/auth.middleware');
const roleMiddleware = require('../src/middlewares/role.middleware');

// CRUD for Clients (artisan or admin)
const artisanOnly = [authMiddleware, roleMiddleware(['artisan', 'admin'])];
router.post('/', artisanOnly, clientController.createClient);
router.get('/', artisanOnly, clientController.getAllClients);
router.get('/:id', artisanOnly, clientController.getClientById);
router.patch('/:id', artisanOnly, clientController.updateClient);
router.delete('/:id', artisanOnly, clientController.deleteClient);
router.post('/:id/measurements', artisanOnly, clientController.addMeasurement);

module.exports = router;
